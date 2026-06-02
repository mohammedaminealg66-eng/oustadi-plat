import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../config/database/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async createReview(studentId: string, teacherProfileId: string, rating: number, comment?: string, requestId?: string) {
    const profile = await this.prisma.teacherProfile.findUnique({ where: { id: teacherProfileId } });
    if (!profile) throw new NotFoundException('Teacher not found');

    const allCompleted = await this.prisma.lessonRequest.findMany({
      where: { studentId, teacherId: profile.userId, status: 'COMPLETED', deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    if (allCompleted.length === 0) {
      throw new ForbiddenException('يجب إكمال حصة مع هذا الأستاذ قبل التقييم');
    }

    const reviewedRequestIds = (await this.prisma.review.findMany({
      where: { requestId: { not: null }, teacherId: teacherProfileId, studentId },
      select: { requestId: true },
    })).map((r) => r.requestId).filter(Boolean) as string[];

    const unReviewedLessons = allCompleted.filter((l) => !reviewedRequestIds.includes(l.id));

    const targetRequestId = requestId || (unReviewedLessons.length > 0 ? unReviewedLessons[0].id : null);

    if (!targetRequestId) {
      throw new ConflictException('All completed lessons for this teacher have already been reviewed');
    }

    const lesson = allCompleted.find((l) => l.id === targetRequestId);
    if (!lesson) {
      throw new ForbiddenException('Invalid lesson request');
    }

    const existingReview = await this.prisma.review.findUnique({
      where: { requestId: targetRequestId },
    });

    if (existingReview) {
      if (existingReview.studentId !== studentId) {
        throw new ForbiddenException('This review does not belong to you');
      }
      throw new ConflictException('You have already submitted a review for this lesson');
    }

    return this.prisma.review.create({
      data: { teacherId: teacherProfileId, studentId, rating, comment, requestId: targetRequestId },
      include: { student: { select: { id: true, fullName: true, avatarKey: true } } },
    });
  }

  async getMyReviews(studentId: string) {
    return this.prisma.review.findMany({
      where: { studentId },
      select: { id: true, teacherId: true, rating: true, comment: true, requestId: true },
    });
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
      include: { user: { select: { id: true, fullName: true, email: true, avatarKey: true } } },
    });
    if (!profile) throw new NotFoundException('Student profile not found');
    return profile;
  }

  async updateProfile(userId: string, data: { bio?: string; city?: string }) {
    const profile = await this.prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Student profile not found');

    return this.prisma.studentProfile.update({
      where: { userId },
      data,
    });
  }

  async toggleFavorite(userId: string, teacherId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { studentId_teacherId: { studentId: userId, teacherId } },
    });

    if (existing) {
      await this.prisma.favorite.delete({ where: { id: existing.id } });
      return { favorited: false };
    }

    await this.prisma.favorite.create({
      data: { studentId: userId, teacherId },
    });
    return { favorited: true };
  }

  async getFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { studentId: userId },
      include: {
        teacher: {
          include: {
            user: { select: { id: true, fullName: true, avatarKey: true } },
            subjects: { include: { subject: true } },
          },
        },
      },
    });
  }
}

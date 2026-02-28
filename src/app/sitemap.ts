import { MetadataRoute } from 'next';
import mongoose from 'mongoose';
import dbConnect from '@/src/lib/dbConnect';
import UserModel from '@/src/model/User';

export const revalidate = 3600; // Cache for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://backka.sandeshkharel.com.np';
  const buildDate = new Date().toISOString();

  const staticPaths = [
    { path: '', priority: 1, freq: 'daily' },
    { path: '/about', priority: 0.8, freq: 'monthly' },
    { path: '/faq', priority: 0.8, freq: 'monthly' },
    { path: '/terms', priority: 0.3, freq: 'monthly' },
    { path: '/privacy-policy', priority: 0.3, freq: 'monthly' },
    { path: '/sign-in', priority: 0.5, freq: 'yearly' },
    { path: '/sign-up', priority: 0.6, freq: 'yearly' },
    { path: '/forgot-password', priority: 0.3, freq: 'yearly' },
    { path: '/reset-password', priority: 0.3, freq: 'yearly' },
    { path: '/settings', priority: 0.4, freq: 'monthly' },
    { path: '/apis', priority: 0.4, freq: 'monthly' },
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((item) => ({
    url: `${baseUrl}${item.path}`,
    lastModified: buildDate,
    changeFrequency: item.freq as any,
    priority: item.priority,
  }));

  let profileRoutes: MetadataRoute.Sitemap = [];

  try {
    await dbConnect();
    const User = mongoose.models.User || UserModel;

    // Use lean() for maximum performance in sitemap generation
    const verifiedUsers = await User.find({ isVerified: true })
      .select('username updatedAt')
      .sort({ updatedAt: -1 }) // Index the most recently active users first
      .limit(50000)            // Sitemap protocol limit per file
      .lean();

    profileRoutes = verifiedUsers.map((user: any) => ({
      url: `${baseUrl}/u/${user.username.toLowerCase()}`,
      lastModified: user.updatedAt ? new Date(user.updatedAt).toISOString() : buildDate,
      changeFrequency: 'weekly',
      priority: 0.7, 
    }));
  } catch (error) {
    console.error("Sitemap dynamic fetch failed:", error);
  }

  return [...staticRoutes, ...profileRoutes];
}
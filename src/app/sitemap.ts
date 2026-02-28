import { MetadataRoute } from 'next';
import mongoose from 'mongoose';
import dbConnect from '@/src/lib/dbConnect';
import UserModel from '@/src/model/User';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://backka.sandeshkharel.com.np';

  // 1. Static Routes
  const staticRoutes: MetadataRoute.Sitemap = ['', '/about', '/faq', '/sign-in', '/sign-up'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Dynamic Profile Routes
  let profileRoutes: MetadataRoute.Sitemap = [];

  try {
    await dbConnect();

    // Safety check: ensure the model is initialized correctly for Next.js HMR
    const User = mongoose.models.User || UserModel;

    // Fetch only verified users
    const verifiedUsers = await User.find({ isVerified: true })
      .select('username updatedAt')
      .lean();

    profileRoutes = verifiedUsers.map((user: any) => ({
      // We force .toLowerCase() here to match your new Schema logic
      url: `${baseUrl}/u/${user.username.toLowerCase()}`,

      // Ensure date is a string in ISO format
      lastModified: user.updatedAt ? new Date(user.updatedAt).toISOString() : new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.5,
    }));
  } catch (error) {
    console.error("Sitemap dynamic fetch failed:", error);
  }

  return [...staticRoutes, ...profileRoutes];
}
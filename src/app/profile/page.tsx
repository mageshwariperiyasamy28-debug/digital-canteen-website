"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UtensilsCrossed, User, Mail, Calendar, LogOut } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { auth } from "@/lib/firebase";
import { signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, userProfile, loading } = useUser();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (userProfile) {
      setName(userProfile.name || user?.displayName || "");
    }
  }, [user, userProfile, loading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdating(true);
    try {
      // Update Firebase Authentication profile
      await updateProfile(user, {
        displayName: name,
      });

      // Update Firestore user document
      if (userProfile) {
        await updateDoc(doc(db, "users", user.uid), {
          name: name,
          updatedAt: new Date(),
        });
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("You have been logged out successfully");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // This case is handled by the redirect effect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
            <Link href="/">
              <Button variant="ghost" className="text-gray-700 dark:text-gray-300">
                ← Back to Home
              </Button>
            </Link>
          </div>

          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto bg-orange-100 dark:bg-orange-900/30 rounded-full p-4 w-24 h-24 flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-orange-600" />
              </div>
              <CardTitle className="text-2xl">
                {userProfile?.name || user.displayName || "User"}
              </CardTitle>
              <CardDescription>
                Manage your account information
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md text-gray-900 dark:text-white">
                        {userProfile?.name || user.displayName || "Not set"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md text-gray-900 dark:text-white">
                      {user.email}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Member Since
                    </Label>
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md text-gray-900 dark:text-white">
                      {user.metadata.creationTime 
                        ? new Date(user.metadata.creationTime).toLocaleDateString() 
                        : "Unknown"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <UtensilsCrossed className="w-4 h-4" />
                      Account Status
                    </Label>
                    <div className="px-3 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md">
                      Active
                    </div>
                  </div>
                </div>

                <CardFooter className="flex flex-col gap-4 mt-8 px-0">
                  {isEditing ? (
                    <div className="flex gap-3 w-full">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setIsEditing(false);
                          setName(userProfile?.name || user.displayName || "");
                        }}
                        disabled={isUpdating}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
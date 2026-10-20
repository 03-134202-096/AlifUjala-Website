import { LearningIcon, IconBadge } from '@/components/ui'
import { useEffect, useState } from "react"
import Image from "next/image"
import type { NextPage } from 'next'
import LoadingIndicator from "@/components/LoadingIndicator"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import SEO from "@/components/SEO"
import { KidsButton, DecorativeBlobs } from "@/components/ui"

const ProfilePage: NextPage = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [upgrading, setUpgrading] = useState(false)
  const [upgradeMsg, setUpgradeMsg] = useState("")
  const [showImgPicker, setShowImgPicker] = useState(false)
  const [selectedProfileImgId, setSelectedProfileImgId] = useState<number | null>(null)
  const profileImages = [
    { id: 0, src: "/images/Kids/Female.webp", label: "Girl" },
    { id: 1, src: "/images/Kids/Male.webp", label: "Boy" },
  ]

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile")
        const data = await res.json()
        if (res.ok) {
          setUser(data.user)
          if (data.user && typeof data.user.profileImgId === 'number') {
            setSelectedProfileImgId(data.user.profileImgId)
          }
        } else {
          setError(data.error)
        }
      } catch (err) {
        setError("Something went wrong")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  async function handleProfileImgChange(imgId: number) {
    setSelectedProfileImgId(imgId)
    setShowImgPicker(false)
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileImgId: imgId }),
      })
      setUser((u: any) => ({ ...u, profileImgId: imgId }))
      localStorage.setItem('profile-image-updated', Date.now().toString())
      window.dispatchEvent(new StorageEvent('storage', { key: 'profile-image-updated' }))
    } catch (err) {
      // silently handle error
    }
  }

  async function handleUpgrade() {
    setUpgrading(true)
    setUpgradeMsg("")
    try {
      const res = await fetch("/api/upgrade", { method: "POST" })
      const data = await res.json()
      if (res.ok && data.ok) {
        setUser((u: any) => ({ ...u, isPremium: true }))
        setUpgradeMsg("🎉 You are now a premium member!")
      } else {
        setUpgradeMsg("😕 " + (data.error || "Upgrade failed."))
      }
    } catch (err) {
      setUpgradeMsg("😕 Upgrade failed.")
    } finally {
      setUpgrading(false)
    }
  }

  if (loading) {
    return (
      <div className="kids-page-bg min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="bg-white/95 dark:bg-gray-900/95 rounded-3xl shadow-candy-lg border-4 border-purple-200 dark:border-purple-800 p-8">
            <LoadingIndicator size={60} message="Loading your profile..." />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="kids-page-bg min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="bg-white/95 dark:bg-gray-900/95 rounded-3xl shadow-candy-lg border-4 border-purple-200 dark:border-purple-800 p-8 text-center max-w-sm w-full">
              <div className="mb-4"><IconBadge name="lock" size="hero" /></div>
            <p className="text-purple-600 dark:text-purple-400 font-bold text-lg" style={{fontFamily: "'Comic Neue', cursive"}}>{error}</p>
            <a href="/login" className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-full border-3 border-white shadow-candy hover:scale-105 transition-all"
              style={{fontFamily: "'Bubblegum Sans', cursive"}}>
              Go to Login 🔑
            </a>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO title="My Profile — AlifUjala" description="Manage your AlifUjala profile." />
      <DecorativeBlobs variant="soft" motifs={["star","pencil"]} />
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Profile Card */}
          <div className="glass-card relative rounded-[2rem] shadow-candy-lg border-[3px] border-purple-200/70 dark:border-purple-700/40 p-6 sm:p-8 overflow-hidden">
            <span className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full bg-purple-300/30 blur-3xl" aria-hidden />
            <span className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-indigo-300/30 blur-3xl" aria-hidden />
            {/* Profile Image & Header */}
            <div className="text-center mb-6">
              <div className="relative w-32 h-32 mx-auto mb-4 group">
                <div className="w-32 h-32 rounded-full border-4 border-indigo-300 dark:border-indigo-600 shadow-candy bg-gradient-to-br from-purple-200 to-indigo-200 dark:from-purple-900 dark:to-indigo-900 flex items-center justify-center overflow-hidden">
                  {typeof selectedProfileImgId === 'number' && profileImages[selectedProfileImgId] ? (
                    <Image
                      src={profileImages[selectedProfileImgId].src}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="object-cover w-32 h-32 rounded-full"
                    />
                  ) : (
                    <IconBadge name="users" size="hero" />
                  )}
                </div>
                {/* Change photo button */}
                <button
                  type="button"
                  onClick={() => setShowImgPicker(true)}
                  className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full border-3 border-white shadow-candy flex items-center justify-center text-white hover:scale-110 transition-all"
                  aria-label="Change profile image"
                >
                  <LearningIcon name="camera" />
                </button>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold mb-1 text-gradient-cool" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
                My Profile
              </h2>

              <div className={`inline-flex px-4 py-1.5 rounded-full text-sm font-bold border-3 ${
                user.isPremium
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-yellow-300 shadow-candy'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'
              }`} style={{fontFamily: "'Comic Neue', cursive"}}>
                {user.isPremium ? "⭐ Premium Member" : "🆓 Free Member"}
              </div>
            </div>

            {/* User Info Cards */}
            <div className="space-y-3 mb-6">
              <div className="bg-purple-50 dark:bg-purple-900/30 rounded-2xl p-4 border-2 border-purple-100 dark:border-purple-800">
                <label className="text-xs font-bold text-purple-400 uppercase tracking-wide" style={{fontFamily: "'Comic Neue', cursive"}}>🆔 User ID</label>
                <p className="text-gray-700 dark:text-gray-200 font-bold text-lg" style={{fontFamily: "'Comic Neue', cursive"}}>{user.id}</p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl p-4 border-2 border-indigo-100 dark:border-indigo-800">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-wide" style={{fontFamily: "'Comic Neue', cursive"}}><LearningIcon name="users" className="mr-1.5" /> Username</label>
                <p className="text-gray-700 dark:text-gray-200 font-bold text-lg" style={{fontFamily: "'Comic Neue', cursive"}}>{user.username}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-4 border-2 border-blue-100 dark:border-blue-800">
                <label className="text-xs font-bold text-blue-400 uppercase tracking-wide" style={{fontFamily: "'Comic Neue', cursive"}}><LearningIcon name="mail" className="mr-1.5" /> Email</label>
                <p className="text-gray-700 dark:text-gray-200 font-bold text-lg" style={{fontFamily: "'Comic Neue', cursive"}}>{user.email}</p>
              </div>
            </div>

            {/* Upgrade Button */}
            {!user.isPremium && (
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full transition-all duration-300 border-3 border-white shadow-candy hover:scale-[1.02] text-lg mb-4"
                style={{fontFamily: "'Bubblegum Sans', cursive"}}
              >
                {upgrading ? "Upgrading... 🔄" : "⭐ Upgrade to Premium!"}
              </button>
            )}

            {upgrading && (
              <div className="mb-4 flex justify-center">
                <LoadingIndicator size={50} message="Upgrading your account..." />
              </div>
            )}

            {upgradeMsg && (
              <div className={`mb-4 p-4 rounded-2xl border-3 text-center font-bold ${
                upgradeMsg.includes('🎉')
                  ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400'
                  : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400'
              }`} style={{fontFamily: "'Comic Neue', cursive"}}>
                {upgradeMsg}
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={async () => {
                await fetch("/api/logout", { method: "POST" })
                window.location.href = "/"
              }}
              className="w-full py-3 bg-gradient-to-r from-red-400 to-orange-400 hover:from-red-500 hover:to-orange-500 text-white font-bold rounded-full transition-all duration-300 border-3 border-white shadow-candy hover:scale-[1.02] text-lg"
              style={{fontFamily: "'Bubblegum Sans', cursive"}}
            >
              Logout 👋
            </button>
          </div>

          {/* Fun decoration */}
          <div className="text-center mt-6">
            <div className="flex justify-center gap-3 text-3xl">
              <IconBadge name="gamepad" />
              <IconBadge name="book" />
              <IconBadge name="star" />
            </div>
          </div>
        </div>
      </main>

      {/* Image Picker Modal */}
      {showImgPicker && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setShowImgPicker(false)} />
          <div className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white/95 dark:bg-gray-900/95 rounded-3xl shadow-candy-lg border-4 border-purple-200 dark:border-purple-800 px-8 py-6 flex flex-col items-center min-w-[260px]">
              <div className="mb-3"><IconBadge name="camera" size="lg" /></div>
              <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
                Choose Avatar
              </h3>
              <div className="flex gap-6 mb-4">
                {profileImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => handleProfileImgChange(img.id)}
                    className={`rounded-full p-1 transition-all duration-300 focus:outline-none hover:scale-110 ${
                      selectedProfileImgId === img.id
                        ? 'border-4 border-indigo-500 ring-4 ring-indigo-200 dark:ring-indigo-800 shadow-candy'
                        : 'border-4 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                    }`}
                    aria-label={`Select ${img.label}`}
                  >
                    <Image
                      src={img.src}
                      alt={img.label}
                      width={72}
                      height={72}
                      className="object-cover rounded-full"
                    />
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1" style={{fontFamily: "'Comic Neue', cursive"}}>{img.label}</p>
                  </button>
                ))}
              </div>
              <button
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-full border-3 border-white shadow-candy hover:scale-105 transition-all"
                style={{fontFamily: "'Bubblegum Sans', cursive"}}
                onClick={() => setShowImgPicker(false)}
              >
                Close ✖
              </button>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  )
}

export default ProfilePage

import { useEffect, useState } from "react"
import Image from "next/image"
import type { NextPage } from 'next'
import LoadingIndicator from "@/components/LoadingIndicator"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const ProfilePage: NextPage = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [upgrading, setUpgrading] = useState(false)
  const [upgradeMsg, setUpgradeMsg] = useState("")
  const [showImgPicker, setShowImgPicker] = useState(false)
  const [selectedProfileImgId, setSelectedProfileImgId] = useState<number | null>(null)
  const profileImages = [
    { id: 0, src: "/images/Kids/Female.png", label: "Female" },
    { id: 1, src: "/images/Kids/Male.png", label: "Male" },
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
      // Trigger navbar update via localStorage (cross-tab)
      localStorage.setItem('profile-image-updated', Date.now().toString())
      // Also dispatch a storage event for same-tab update
      window.dispatchEvent(new StorageEvent('storage', { key: 'profile-image-updated' }))
    } catch (err) {
      // handle error if needed
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
        setUpgradeMsg("You are now a premium user!")
      } else {
        setUpgradeMsg(data.error || "Upgrade failed.")
      }
    } catch (err) {
      setUpgradeMsg("Upgrade failed.")
    } finally {
      setUpgrading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-8 flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl px-3 py-2">
            <div className="flex flex-col items-center space-y-1">
              <LoadingIndicator size={60} message="Fetching your profile..." />
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }
  
  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-8 flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl px-3 py-2">
            <div className="text-center">
              <div className="text-6xl mb-1">❌</div>
              <p className="text-red-300 text-lg">{error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-8 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl px-3 py-2">
          <div className="text-center mb-3">
            <div className="relative w-28 h-28 bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-full flex items-center justify-center mx-auto mb-2 group" style={{overflow: 'visible'}}>
              {typeof selectedProfileImgId === 'number' && profileImages[selectedProfileImgId] ? (
                <Image
                  src={profileImages[selectedProfileImgId].src}
                  alt="Profile"
                  width={112}
                  height={112}
                  className="object-cover w-28 h-28 rounded-full"
                />
              ) : (
                <span className="text-4xl text-white">👤</span>
              )}
              <button
                type="button"
                className="absolute inset-0 w-full h-full flex items-center justify-center bg-black transition-all z-50 opacity-0 group-hover:opacity-75"
                onClick={e => { e.stopPropagation(); setShowImgPicker((v) => !v); }}
                aria-label="Change profile image"
                style={{ borderRadius: '9999px' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-12 h-12 drop-shadow-lg">
                  <path d="M12 8.5A3.5 3.5 0 1 0 12 15.5A3.5 3.5 0 1 0 12 8.5Z"/>
                  <path d="M4 7V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V7C20 5.89543 19.1046 5 18 5H16.382L15.276 3.44721C15.1054 3.18439 14.8197 3 14.5 3H9.5C9.1803 3 8.8946 3.18439 8.724 3.44721L7.618 5H6C4.89543 5 4 5.89543 4 7ZM12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17Z"/>
                </svg>
              </button>
              {showImgPicker && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                    onClick={() => setShowImgPicker(false)}
                  />
                  {/* Picker Card */}
                  <div className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 px-6 py-5 flex flex-col items-center min-w-[220px]">
                      <div className="mb-3 text-lg font-semibold text-gray-700">Choose Profile Image</div>
                      <div className="flex gap-6 mb-2">
                        {profileImages.map((img) => (
                          <button
                            key={img.id}
                            onClick={() => handleProfileImgChange(img.id)}
                            className={`border-4 rounded-full p-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 ${selectedProfileImgId === img.id ? 'border-pink-500 ring-2 ring-pink-300' : 'border-gray-200'} bg-white hover:border-purple-400`}
                            aria-label={`Select ${img.label}`}
                          >
                            <Image
                              src={img.src}
                              alt={img.label}
                              width={64}
                              height={64}
                              className="object-cover rounded-full"
                            />
                          </button>
                        ))}
                      </div>
                      <button
                        className="mt-2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow hover:from-purple-600 hover:to-pink-600 transition-all text-sm font-medium"
                        onClick={() => setShowImgPicker(false)}
                      >Cancel</button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">My Profile</h2>
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              user.isPremium 
                ? 'bg-gradient-to-r from-yellow-500/80 to-orange-500/80 text-white' 
                : 'bg-white/20 text-white/80'
            }`}>
              {user.isPremium ? " Premium Member" : "Free Member"}
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <label className="text-white/60 text-sm">User ID</label>
              <p className="text-white font-medium">{user.id}</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <label className="text-white/60 text-sm">Username</label>
              <p className="text-white font-medium">{user.username}</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <label className="text-white/60 text-sm">Email</label>
              <p className="text-white font-medium">{user.email}</p>
            </div>
          </div>
          
          {!user.isPremium && (
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="w-full py-3 bg-gradient-to-r from-yellow-500/80 to-orange-500/80 hover:from-yellow-600/90 hover:to-orange-600/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20 flex items-center justify-center space-x-2"
            >
              <span>{upgrading ? "Upgrading..." : "Upgrade to Premium"}</span>
            </button>
          )}
          
          {upgrading && (
            <div className="mt-6 flex justify-center">
              <LoadingIndicator size={60} message="Upgrading your account..." />
            </div>
          )}
          
          {upgradeMsg && (
            <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-lg">
              <p className="text-center text-sm" style={{ color: user.isPremium ? "#16db65" : "#fff" }}>
                {upgradeMsg}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ProfilePage

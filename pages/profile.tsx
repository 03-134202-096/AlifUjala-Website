import { useEffect, useState } from "react"
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

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile")
        const data = await res.json()
        if (res.ok) {
          setUser(data.user)
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

  async function handleUpgrade() {
    setUpgrading(true)
    setUpgradeMsg("")
    try {
      const res = await fetch("/api/upgrade", { method: "POST" })
      const data = await res.json()
      if (res.ok && data.ok) {
        // Fetch fresh profile data after upgrade
        const profileRes = await fetch("/api/profile")
        const profileData = await profileRes.json()
        if (profileRes.ok && profileData.user) {
          setUser(profileData.user)
        } else {
          setUser((u: any) => ({ ...u, isPremium: true }))
        }
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
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-full flex items-center justify-center mx-auto mb-1">
              <span className="text-3xl text-white">👤</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">My Profile</h2>
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              user.isPremium 
                ? 'bg-gradient-to-r from-yellow-500/80 to-orange-500/80 text-white' 
                : 'bg-white/20 text-white/80'
            }`}>
              {user.isPremium ? "✨ Premium Member" : "Free Member"}
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
              <span>✨</span>
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

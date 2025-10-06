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
        <main className="min-h-screen py-8">
          <div className="min-h-[50vh] flex items-center justify-center">
            <LoadingIndicator message="Fetching your profile..." />
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
        <main className="min-h-screen py-8">
          <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
            <p style={{ color: "red" }}>❌ {error}</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-8">
        <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
          <h2>Profile</h2>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Status:</strong> {user.isPremium ? "Premium" : "Free"}</p>
          {!user.isPremium && (
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className={"btn-upgrade mt-4 px-6 py-2 rounded-full font-bold border border-white text-white bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-300 transition " + (upgrading ? "opacity-60 cursor-not-allowed" : "hover:bg-pink-600 cursor-pointer")}
            >
              {upgrading ? "Upgrading..." : "Upgrade to Premium"}
            </button>
          )}
          {upgrading && (
            <div className="mt-6">
              <LoadingIndicator size={96} message="Upgrading your account..." />
            </div>
          )}
          {upgradeMsg && <p style={{ marginTop: 8, color: user.isPremium ? "#16db65" : "#fff" }}>{upgradeMsg}</p>}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ProfilePage

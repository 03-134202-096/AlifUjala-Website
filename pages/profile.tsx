import { useEffect, useState } from "react"
import type { NextPage } from 'next'

const ProfilePage: NextPage = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: "red" }}>❌ {error}</p>

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Profile</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  )
}

export default ProfilePage


import { redirect } from 'next/navigation'
import React from 'react'

export default function AdminPage() {
  redirect("/account/myprofile")
}
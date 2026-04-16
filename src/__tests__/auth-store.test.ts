import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '#/stores/auth-store'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().auth.reset()
  })

  it('has correct initial state', () => {
    const { auth } = useAuthStore.getState()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.accessToken).toBe('')
    expect(auth.idToken).toBe('')
    expect(auth.userData).toBeUndefined()
  })

  it('setAccessToken updates isAuthenticated', () => {
    const { auth } = useAuthStore.getState()
    auth.setAccessToken('fake-token')

    const updated = useAuthStore.getState().auth
    expect(updated.accessToken).toBe('fake-token')
    expect(updated.isAuthenticated).toBe(true)
  })

  it('reset clears all auth data', () => {
    const { auth } = useAuthStore.getState()
    auth.setAccessToken('fake')
    auth.setIdToken('id')
    auth.setUserData({
      user: {
        uid: 'u1',
        nick: 'test',
        avatar: '',
        email: 'test@example.com',
        status: 1,
        kycLevel: 0,
        vipLevel: 0,
        canTrade: 1,
        canWithdraw: 1,
        futuresTrade: 0,
        isCompany: 0,
        companyName: '',
        companyType: '',
      },
      preferences: {
        language: 'mn',
        theme: 'dark',
        timezone: 'UTC',
        currency: 'USD',
        createdTime: 0,
        updatedTime: 0,
      },
    })

    auth.reset()

    const updated = useAuthStore.getState().auth
    expect(updated.accessToken).toBe('')
    expect(updated.idToken).toBe('')
    expect(updated.isAuthenticated).toBe(false)
    expect(updated.userData).toBeUndefined()
  })
})

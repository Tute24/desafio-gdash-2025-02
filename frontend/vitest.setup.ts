import '@testing-library/dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  sessionStorage.clear()
  cleanup()
})

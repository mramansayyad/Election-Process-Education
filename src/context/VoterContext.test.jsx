import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { VoterProvider, useVoter } from './VoterContext'

// Test component to access context
const TestConsumer = () => {
  const { voterData, updateVoterData, resetJourney } = useVoter()
  return (
    <div>
      <div data-testid="step">{voterData.step}</div>
      <div data-testid="pinCode">{voterData.pinCode || 'none'}</div>
      <button onClick={() => updateVoterData({ pinCode: '110001', step: 3 })}>Update</button>
      <button onClick={resetJourney}>Reset</button>
    </div>
  )
}

describe('VoterContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('provides initial default values', () => {
    render(
      <VoterProvider>
        <TestConsumer />
      </VoterProvider>
    )
    expect(screen.getByTestId('step').textContent).toBe('0')
    expect(screen.getByTestId('pinCode').textContent).toBe('none')
  })

  it('updates voter data correctly', async () => {
    render(
      <VoterProvider>
        <TestConsumer />
      </VoterProvider>
    )
    
    await act(async () => {
      screen.getByText('Update').click()
    })

    expect(screen.getByTestId('step').textContent).toBe('3')
    expect(screen.getByTestId('pinCode').textContent).toBe('110001')
  })

  it('resets journey but preserves user', async () => {
    render(
      <VoterProvider>
        <TestConsumer />
      </VoterProvider>
    )
    
    await act(async () => {
      screen.getByText('Update').click()
    })
    
    await act(async () => {
      screen.getByText('Reset').click()
    })

    expect(screen.getByTestId('step').textContent).toBe('0')
    expect(screen.getByTestId('pinCode').textContent).toBe('none')
  })
})

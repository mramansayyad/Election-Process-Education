import { describe, it, expect } from 'vitest'
import { getStateFromPin, getDeadlinesForState } from './electionDeadlines'

describe('electionDeadlines utility', () => {
  describe('getStateFromPin', () => {
    it('should correctly map Delhi (11)', () => {
      expect(getStateFromPin('110001')).toBe('DL')
    })

    it('should correctly map Maharashtra (40)', () => {
      expect(getStateFromPin('400001')).toBe('MH')
    })

    it('should correctly map Tamil Nadu (60)', () => {
      expect(getStateFromPin('600001')).toBe('TN')
    })

    it('should return null for invalid or missing prefix', () => {
      expect(getStateFromPin('999999')).toBeNull()
      expect(getStateFromPin('99')).toBeNull()
      expect(getStateFromPin('')).toBeNull()
    })
  })

  describe('getDeadlinesForState', () => {
    it('should return specific milestones for Delhi', () => {
      const deadlines = getDeadlinesForState('DL')
      expect(deadlines.some(d => d.title.includes('Delhi Vidhan Sabha'))).toBe(true)
    })

    it('should return national milestones for unknown states', () => {
      const deadlines = getDeadlinesForState('ZZ')
      expect(deadlines.some(d => d.title === 'National Voters\' Day')).toBe(true)
      expect(deadlines.every(d => !d.title.includes('Vidhan Sabha'))).toBe(true)
    })

    it('should always include National Voters\' Day', () => {
      const states = ['MH', 'UP', 'KA', null]
      states.forEach(state => {
        const deadlines = getDeadlinesForState(state)
        expect(deadlines.some(d => d.title === 'National Voters\' Day')).toBe(true)
      })
    })
  })
})

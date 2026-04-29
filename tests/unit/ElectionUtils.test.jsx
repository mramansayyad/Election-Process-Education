import { describe, it, expect } from 'vitest';
import { getStateFromPin, getDeadlinesForState, getDaysRemaining } from '../../src/utils/electionDeadlines';
import { STATE_NAMES } from '../../src/config/constants';

describe('Election Utilities Unit Tests', () => {
  describe('getStateFromPin', () => {
    it('should correctly identify Maharashtra from PIN 400001', () => {
      expect(getStateFromPin('400001')).toBe('MH');
    });

    it('should correctly identify Delhi from PIN 110001', () => {
      expect(getStateFromPin('110001')).toBe('DL');
    });

    it('should correctly identify Bihar from PIN 800001', () => {
      expect(getStateFromPin('800001')).toBe('BR');
    });

    it('should return null for invalid or unknown PIN prefixes', () => {
      expect(getStateFromPin('000000')).toBeNull();
      expect(getStateFromPin('999999')).toBeNull();
    });

    it('should handle short PIN codes gracefully', () => {
      expect(getStateFromPin('40')).toBe('MH');
      expect(getStateFromPin('1')).toBeNull();
    });
  });

  describe('getDeadlinesForState', () => {
    it('should return national milestones for unknown states', () => {
      const deadlines = getDeadlinesForState('XX');
      expect(deadlines.length).toBeGreaterThan(0);
      expect(deadlines.some(d => d.id === 'nvd')).toBe(true);
    });

    it('should include Vidhan Sabha elections for known states like MH', () => {
      const deadlines = getDeadlinesForState('MH');
      expect(deadlines.some(d => d.id === 'vidhan')).toBe(true);
      expect(deadlines.find(d => d.id === 'vidhan').title).toContain('Maharashtra');
    });

    it('should derive state from PIN if state code is not provided', () => {
      const deadlines = getDeadlinesForState('400001');
      expect(deadlines.find(d => d.id === 'vidhan').title).toContain('Maharashtra');
    });
  });

  describe('getDaysRemaining', () => {
    it('should return positive days for future dates', () => {
      const future = new Date();
      future.setDate(future.getDate() + 10);
      const dateStr = future.toISOString().split('T')[0];
      expect(getDaysRemaining(dateStr)).toBeGreaterThan(0);
      expect(getDaysRemaining(dateStr)).toBeLessThanOrEqual(10);
    });

    it('should return negative or zero days for past/today dates', () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      const dateStr = past.toISOString().split('T')[0];
      expect(getDaysRemaining(dateStr)).toBeLessThanOrEqual(0);
    });
  });
});

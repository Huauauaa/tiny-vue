import { describe, expect, test } from 'vitest'
import { handleMaxTimePick, handleTimeChange, handleTimeInput } from '@opentiny/vue-renderless/date-range'

describe('datetimerange end time vs start (#4185)', () => {
  test('handleMaxTimePick clamps end time instead of rewriting start', () => {
    const state = {
      minDate: new Date(2026, 8, 4, 10, 0, 0),
      maxDate: new Date(2026, 8, 4, 10, 0, 0),
      maxTimePickerVisible: true
    }

    handleMaxTimePick({ state })(new Date(2026, 8, 4, 5, 0, 0), false, false)

    expect(state.minDate.getHours()).toBe(10)
    expect(state.maxDate.getHours()).toBe(10)
    expect(state.maxTimePickerVisible).toBe(false)
  })

  test('handleTimeChange clamps end time instead of rewriting start', () => {
    const state = {
      minDate: new Date(2026, 8, 4, 10, 0, 0),
      maxDate: new Date(2026, 8, 4, 10, 0, 0),
      timeFormat: 'HH:mm:ss',
      timeUserInput: { min: null, max: '05:00:00' },
      maxTimePickerVisible: true
    }
    const vm = {
      $refs: {
        maxTimePicker: { state: { value: null } }
      }
    }
    const t = (key) => key

    handleTimeChange({ state, t, vm })('05:00:00', 'max')

    expect(state.minDate.getHours()).toBe(10)
    expect(state.maxDate.getHours()).toBe(10)
    expect(state.maxDate).not.toBe(state.minDate)
    expect(state.timeUserInput.max).toBeNull()
    expect(vm.$refs.maxTimePicker.state.value).toEqual(state.maxDate)
  })

  test('raising end when start moves past it uses a cloned date', () => {
    const state = {
      minDate: new Date(2026, 8, 4, 0, 0, 0),
      maxDate: new Date(2026, 8, 4, 0, 0, 0),
      timeFormat: 'HH:mm:ss',
      timeUserInput: { min: null, max: null },
      minTimePickerVisible: true
    }
    const vm = {
      $refs: {
        minTimePicker: { state: { value: null } }
      }
    }
    const t = (key) => key

    handleTimeChange({ state, t, vm })('10:00:00', 'min')

    expect(state.minDate.getHours()).toBe(10)
    expect(state.maxDate.getHours()).toBe(10)
    expect(state.maxDate).not.toBe(state.minDate)
  })

  test('handleTimeInput clamps end and clears draft display', () => {
    const state = {
      minDate: new Date(2026, 8, 4, 10, 0, 0),
      maxDate: new Date(2026, 8, 4, 10, 0, 0),
      timeFormat: 'HH:mm:ss',
      timeUserInput: { min: null, max: null }
    }
    const t = (key) => key

    handleTimeInput({ state, t })('05:00:00', 'max')

    expect(state.minDate.getHours()).toBe(10)
    expect(state.maxDate.getHours()).toBe(10)
    expect(state.timeUserInput.max).toBeNull()
  })
})

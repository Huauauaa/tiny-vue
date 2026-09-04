import { describe, expect, test } from 'vitest'
import { handleMaxTimePick, handleTimeChange } from '@opentiny/vue-renderless/date-range'

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
    expect(vm.$refs.maxTimePicker.state.value).toEqual(state.maxDate)
  })
})

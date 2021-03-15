import React from 'react'
import RNPickerSelect from 'react-native-picker-select'

const Select = ({ value, onChange, options }) => (
  <RNPickerSelect
    value={value?.value || null}
    items={options}
    onValueChange={v => onChange(v ? { label: options.find(o => o.value === v).label, value: v } : null)}
  />
)

export default Select
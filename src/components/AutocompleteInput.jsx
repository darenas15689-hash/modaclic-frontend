function AutocompleteInput({ id, options = [], value = '', minLength = 2, ...props }) {
  const normalizedValue = String(value ?? '')
  const query = normalizedValue.trim().toLowerCase()
  const suggestions = query.length >= minLength
    ? [...new Set(options.filter(Boolean).map(String))]
        .filter(option => option.toLowerCase().includes(query))
    : []

  return (
    <>
      <input
        {...props}
        value={value}
        list={suggestions.length ? id : undefined}
      />
      <datalist id={id}>
        {suggestions.map(option => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </>
  )
}

export default AutocompleteInput

function FacetCheckbox({
  label,
  count,
  checked,
  onChange
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className='flex items-center space-x-3 py-2 px-4 hover:bg-gray-50 rounded cursor-pointer group'>
      <input
        type='checkbox'
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className='form-checkbox h-5 w-5 text-red-600 rounded border-gray-300 focus:ring-red-500 transition-colors'
      />
      <span className='text-sm text-gray-700 group-hover:text-gray-900'>{label}</span>
      <span className='text-xs text-gray-500 group-hover:text-gray-700'>({count})</span>
    </label>
  );
}

export default FacetCheckbox;

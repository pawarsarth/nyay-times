export default function SearchBar({ value, onChange }) {
  return (
    <label className="block">
      <span className="sr-only">Search articles</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search articles"
        className="w-full sm:w-64 bg-white border border-rule rounded-sm px-3 py-2 text-sm placeholder:text-mute"
      />
    </label>
  )
}

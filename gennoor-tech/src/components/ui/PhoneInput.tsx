'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'

interface CountryData {
  name: string
  code: string       // ISO 2-letter
  dialCode: string   // e.g. "+91"
  digits: number     // expected number of digits (after dial code)
}

const countries: CountryData[] = [
  { name: 'India', code: 'IN', dialCode: '+91', digits: 10 },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', digits: 9 },
  { name: 'UAE', code: 'AE', dialCode: '+971', digits: 9 },
  { name: 'Qatar', code: 'QA', dialCode: '+974', digits: 8 },
  { name: 'Bahrain', code: 'BH', dialCode: '+973', digits: 8 },
  { name: 'Kuwait', code: 'KW', dialCode: '+965', digits: 8 },
  { name: 'Oman', code: 'OM', dialCode: '+968', digits: 8 },
  { name: 'United States', code: 'US', dialCode: '+1', digits: 10 },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', digits: 10 },
  { name: 'Canada', code: 'CA', dialCode: '+1', digits: 10 },
  { name: 'Australia', code: 'AU', dialCode: '+61', digits: 9 },
  { name: 'Singapore', code: 'SG', dialCode: '+65', digits: 8 },
  { name: 'Malaysia', code: 'MY', dialCode: '+60', digits: 10 },
  { name: 'Germany', code: 'DE', dialCode: '+49', digits: 11 },
  { name: 'France', code: 'FR', dialCode: '+33', digits: 9 },
  { name: 'South Africa', code: 'ZA', dialCode: '+27', digits: 9 },
  { name: 'Nigeria', code: 'NG', dialCode: '+234', digits: 10 },
  { name: 'Kenya', code: 'KE', dialCode: '+254', digits: 9 },
  { name: 'Tanzania', code: 'TZ', dialCode: '+255', digits: 9 },
  { name: 'Egypt', code: 'EG', dialCode: '+20', digits: 10 },
  { name: 'Japan', code: 'JP', dialCode: '+81', digits: 10 },
  { name: 'South Korea', code: 'KR', dialCode: '+82', digits: 10 },
  { name: 'Indonesia', code: 'ID', dialCode: '+62', digits: 11 },
  { name: 'Philippines', code: 'PH', dialCode: '+63', digits: 10 },
  { name: 'Bangladesh', code: 'BD', dialCode: '+880', digits: 10 },
  { name: 'Pakistan', code: 'PK', dialCode: '+92', digits: 10 },
  { name: 'Sri Lanka', code: 'LK', dialCode: '+94', digits: 9 },
  { name: 'Nepal', code: 'NP', dialCode: '+977', digits: 10 },
  { name: 'Thailand', code: 'TH', dialCode: '+66', digits: 9 },
  { name: 'Vietnam', code: 'VN', dialCode: '+84', digits: 9 },
  { name: 'Brazil', code: 'BR', dialCode: '+55', digits: 11 },
  { name: 'Mexico', code: 'MX', dialCode: '+52', digits: 10 },
  { name: 'Argentina', code: 'AR', dialCode: '+54', digits: 10 },
  { name: 'Colombia', code: 'CO', dialCode: '+57', digits: 10 },
  { name: 'Chile', code: 'CL', dialCode: '+56', digits: 9 },
  { name: 'Turkey', code: 'TR', dialCode: '+90', digits: 10 },
  { name: 'Iraq', code: 'IQ', dialCode: '+964', digits: 10 },
  { name: 'Jordan', code: 'JO', dialCode: '+962', digits: 9 },
  { name: 'Lebanon', code: 'LB', dialCode: '+961', digits: 8 },
  { name: 'Morocco', code: 'MA', dialCode: '+212', digits: 9 },
  { name: 'Tunisia', code: 'TN', dialCode: '+216', digits: 8 },
  { name: 'Ghana', code: 'GH', dialCode: '+233', digits: 9 },
  { name: 'Ethiopia', code: 'ET', dialCode: '+251', digits: 9 },
  { name: 'Uganda', code: 'UG', dialCode: '+256', digits: 9 },
  { name: 'Rwanda', code: 'RW', dialCode: '+250', digits: 9 },
  { name: 'Ireland', code: 'IE', dialCode: '+353', digits: 9 },
  { name: 'Netherlands', code: 'NL', dialCode: '+31', digits: 9 },
  { name: 'Sweden', code: 'SE', dialCode: '+46', digits: 9 },
  { name: 'Norway', code: 'NO', dialCode: '+47', digits: 8 },
  { name: 'Denmark', code: 'DK', dialCode: '+45', digits: 8 },
  { name: 'Finland', code: 'FI', dialCode: '+358', digits: 9 },
  { name: 'Switzerland', code: 'CH', dialCode: '+41', digits: 9 },
  { name: 'Italy', code: 'IT', dialCode: '+39', digits: 10 },
  { name: 'Spain', code: 'ES', dialCode: '+34', digits: 9 },
  { name: 'Portugal', code: 'PT', dialCode: '+351', digits: 9 },
  { name: 'Poland', code: 'PL', dialCode: '+48', digits: 9 },
  { name: 'Russia', code: 'RU', dialCode: '+7', digits: 10 },
  { name: 'China', code: 'CN', dialCode: '+86', digits: 11 },
  { name: 'Taiwan', code: 'TW', dialCode: '+886', digits: 9 },
  { name: 'Hong Kong', code: 'HK', dialCode: '+852', digits: 8 },
  { name: 'New Zealand', code: 'NZ', dialCode: '+64', digits: 9 },
]

interface PhoneInputProps {
  label: string
  id: string
  value: string
  onChange: (fullNumber: string, countryCode: string, country: string) => void
  required?: boolean
  selectedCountryCode?: string
}

export default function PhoneInput({ label, id, value, onChange, required = true, selectedCountryCode }: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(countries[0])
  const [number, setNumber] = useState('')
  const [error, setError] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Sync with external selectedCountryCode
  useEffect(() => {
    if (selectedCountryCode) {
      const found = countries.find(c => c.code === selectedCountryCode)
      if (found && found.code !== selectedCountry.code) {
        setSelectedCountry(found)
        // Re-validate current number with new country
        if (number) {
          validateAndUpdate(number, found)
        }
      }
    }
  }, [selectedCountryCode])

  // Parse initial value
  useEffect(() => {
    if (value && !number) {
      // Try to extract country code and number from full value
      for (const c of countries) {
        if (value.startsWith(c.dialCode)) {
          setSelectedCountry(c)
          const num = value.slice(c.dialCode.length).replace(/\s/g, '')
          setNumber(num)
          return
        }
      }
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus()
    }
  }, [isOpen])

  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.dialCode.includes(search)
  )

  const validateAndUpdate = (num: string, country: CountryData) => {
    const digitsOnly = num.replace(/\D/g, '')

    if (digitsOnly.length > country.digits) {
      return // Don't allow more digits than expected
    }

    setNumber(digitsOnly)

    if (digitsOnly.length === 0) {
      setError('')
      onChange('', country.dialCode, country.name)
    } else if (digitsOnly.length === country.digits) {
      setError('')
      onChange(`${country.dialCode}${digitsOnly}`, country.dialCode, country.name)
    } else {
      setError(`${country.name} numbers must be ${country.digits} digits`)
      onChange('', country.dialCode, country.name)
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndUpdate(e.target.value, selectedCountry)
  }

  const handleSelectCountry = (country: CountryData) => {
    setSelectedCountry(country)
    setIsOpen(false)
    setSearch('')
    setNumber('')
    setError('')
    onChange('', country.dialCode, country.name)
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex gap-0">
        {/* Country Code Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 px-2.5 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 transition-colors min-w-[100px] h-[42px]"
          >
            <span className="text-sm font-medium text-gray-700">{selectedCountry.code}</span>
            <span className="text-sm text-gray-500">{selectedCountry.dialCode}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-auto" />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-64 flex flex-col">
              {/* Search */}
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Country List */}
              <div className="overflow-y-auto flex-1">
                {filteredCountries.length === 0 ? (
                  <div className="px-3 py-4 text-sm text-gray-500 text-center">No countries found</div>
                ) : (
                  filteredCountries.map(country => (
                    <button
                      key={`${country.code}-${country.dialCode}`}
                      type="button"
                      onClick={() => handleSelectCountry(country)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-primary-50 transition-colors ${
                        selectedCountry.code === country.code ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                      }`}
                    >
                      <span className="font-medium w-8">{country.code}</span>
                      <span className="text-gray-500 w-12">{country.dialCode}</span>
                      <span className="truncate">{country.name}</span>
                      <span className="ml-auto text-xs text-gray-400">{country.digits} digits</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Number Input */}
        <input
          type="tel"
          id={id}
          required={required}
          value={number}
          onChange={handleNumberChange}
          maxLength={selectedCountry.digits}
          className={`flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:border-primary-500 h-[42px] ${
            error ? 'focus:ring-red-300 border-red-300' : 'focus:ring-primary-500'
          }`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {!error && number.length > 0 && number.length === selectedCountry.digits && (
        <p className="text-xs text-green-600 mt-1">{selectedCountry.dialCode} {number}</p>
      )}
    </div>
  )
}

export { countries }
export type { CountryData }

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
            <span className="text-white text-xs">🎓</span>
          </div>
          <span>@BridgeTech-Solutions</span>
          <span>Tous droits réservés</span>
        </div>

        <div className="flex items-center space-x-6">
          <a href="#" className="hover:text-gray-700">
            Condition d'utilisation
          </a>
          <a href="#" className="hover:text-gray-700">
            Politique de confidentialité
          </a>
          <a href="#" className="hover:text-gray-700">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}

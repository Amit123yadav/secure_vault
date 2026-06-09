import { VaultProvider, useVault } from './context/VaultContext';
import LockScreen from './components/LockScreen';
import VaultDashboard from './components/VaultDashboard';

function AppInner() {
  const { isUnlocked } = useVault();
  return isUnlocked ? <VaultDashboard /> : <LockScreen />;
}

export default function App() {
  return (
    <VaultProvider>
      <AppInner />
    </VaultProvider>
  );
}

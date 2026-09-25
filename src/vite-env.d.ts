/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATA_MODE?: 'demo' | 'onchain'
  readonly VITE_DEPLOYMENT_BLOCK?: string
  readonly VITE_RANDOMNESS_PROVIDER_ADDRESS?: string
  readonly VITE_CHAIN_ID?: string;
  readonly VITE_RPC_URL?: string;
  readonly VITE_EXPLORER_URL?: string;
  readonly VITE_USDG_ADDRESS?: string;
  readonly VITE_POOL_FACTORY_ADDRESS?: string;
  readonly VITE_POOL_MANAGER_ADDRESS?: string;
  readonly VITE_FEE_VAULT_ADDRESS?: string;
  readonly VITE_RANDOMNESS_PROVIDER?: string;
  readonly VITE_WALLETCONNECT_PROJECT_ID?: string;
  readonly VITE_SHOW_DEMO_INDICATOR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

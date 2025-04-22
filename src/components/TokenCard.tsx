import React from 'react';
import { CircleDollarSign, Loader, TrendingUp, TrendingDown } from 'lucide-react';

interface TokenCardProps {
  tokenAddress: string;
}

// Interface pour représenter la structure des données de jeton
interface TokenData {
  name: string | null;
  symbol: string | null;
  logoURI: string | null;
  decimals: number | null;
  price: number | null;
  priceChange24h: number | null;
  marketCap: number | null;
}

// Cache pour stocker les informations des jetons déjà consultés
const tokenCache: Record<string, TokenData> = {};

class TokenCard extends React.Component<TokenCardProps, any> {
  constructor(props: TokenCardProps) {
    super(props);
    this.state = {
      loading: true,
      tokenData: {
        name: null,
        symbol: null,
        logoURI: null,
        decimals: null,
        price: null,
        priceChange24h: null,
        marketCap: null,
      },
      error: null
    };
  }

  componentDidMount() {
    this.fetchTokenData();
  }
  
  componentDidUpdate(prevProps: TokenCardProps) {
    if (prevProps.tokenAddress !== this.props.tokenAddress) {
      this.fetchTokenData();
    }
  }

  async fetchTokenData() {
    try {
      this.setState({ loading: true, error: null });
      
      // Vérifier d'abord dans le cache local
      if (tokenCache[this.props.tokenAddress]) {
        this.setState({
          tokenData: tokenCache[this.props.tokenAddress],
          loading: false
        });
        return;
      }
      
      // Essayer toutes les sources pour les métadonnées de base
      let tokenData = null;
      
      // 1. Essayer Jupiter API
      tokenData = await this.tryJupiterAPI();
      
      // 2. Si Jupiter échoue, essayer Solscan API
      if (!tokenData || !tokenData.name || !tokenData.symbol) {
        const solscanData = await this.trySolscanAPI();
        if (solscanData) {
          tokenData = tokenData ? { ...tokenData, ...solscanData } : solscanData;
        }
      }
      
      // 3. Essayer DexScreener pour obtenir des données de prix et de marché
      const dexScreenerData = await this.tryDexScreenerAPI();
      if (dexScreenerData) {
        tokenData = tokenData ? { ...tokenData, ...dexScreenerData } : dexScreenerData;
      }
      
      // 4. Essayer Birdeye API pour les tokens récents
      if (!tokenData || !tokenData.name || !tokenData.symbol) {
        const birdeyeData = await this.tryBirdeyeAPI();
        if (birdeyeData) {
          tokenData = tokenData ? { ...tokenData, ...birdeyeData } : birdeyeData;
        }
      }
      
      // 5. Essayer CoinGecko pour données de prix complètes
      const coinGeckoData = await this.tryCoinGeckoAPI();
      if (coinGeckoData) {
        tokenData = tokenData ? {
          ...tokenData,
          name: tokenData.name || coinGeckoData.name,
          symbol: tokenData.symbol || coinGeckoData.symbol,
          logoURI: tokenData.logoURI || coinGeckoData.logoURI,
          price: coinGeckoData.price,
          priceChange24h: coinGeckoData.priceChange24h,
          marketCap: coinGeckoData.marketCap
        } : coinGeckoData;
      }
      
      // Si nous avons trouvé des données, mettre à jour l'état et le cache
      if (tokenData && (tokenData.name || tokenData.symbol)) {
        // Vérifier et nettoyer les données
        if (!tokenData.name) tokenData.name = tokenData.symbol;
        if (!tokenData.symbol) tokenData.symbol = tokenData.name?.substring(0, 5);
        
        // Stocker dans le cache
        tokenCache[this.props.tokenAddress] = tokenData;
        
        this.setState({
          tokenData,
          loading: false
        });
        return;
      }
      
      // Si aucune information n'est trouvée, essayer de récupérer des données minimales depuis la blockchain Solana
      try {
        const solanaData = await this.getSolanaOnChainData();
        if (solanaData) {
          tokenCache[this.props.tokenAddress] = solanaData;
          this.setState({
            tokenData: solanaData,
            loading: false
          });
          return;
        }
      } catch (error) {
        console.log('Failed to get on-chain data:', error);
      }
      
      // Fallback final avec des informations minimales
      const fallbackData = {
        name: `Token ${this.props.tokenAddress.substring(0, 4)}...${this.props.tokenAddress.substring(this.props.tokenAddress.length - 4)}`,
        symbol: `SPL`,
        logoURI: null,
        decimals: 9,
        price: null,
        priceChange24h: null,
        marketCap: null
      };
      
      // Stocker également ces informations minimales dans le cache
      tokenCache[this.props.tokenAddress] = fallbackData;
      
      this.setState({
        tokenData: fallbackData,
        loading: false
      });
    } catch (err) {
      console.error('Error fetching token data:', err);
      const fallbackData = {
        name: `Token ${this.props.tokenAddress.substring(0, 4)}...${this.props.tokenAddress.substring(this.props.tokenAddress.length - 4)}`,
        symbol: 'SPL',
        logoURI: null,
        decimals: 9,
        price: null,
        priceChange24h: null,
        marketCap: null
      };
      
      this.setState({ 
        error: 'Failed to load token data',
        loading: false,
        tokenData: fallbackData
      });
    }
  }

  // Méthode pour essayer l'API Jupiter
  async tryJupiterAPI(): Promise<TokenData | null> {
    try {
      const jupiterResponse = await fetch('https://token.jup.ag/all');
      if (jupiterResponse.ok) {
        const allTokens = await jupiterResponse.json();
        const token = allTokens.find((t: any) => t.address === this.props.tokenAddress);
        
        if (token) {
          return {
            name: token.name || 'Unknown Token',
            symbol: token.symbol || '???',
            logoURI: token.logoURI || null,
            decimals: token.decimals || 9,
            price: null,
            priceChange24h: null,
            marketCap: null
          };
        }
      }
    } catch (error) {
      console.log('Jupiter API error:', error);
    }
    return null;
  }

  // Méthode pour essayer l'API Solscan
  async trySolscanAPI(): Promise<TokenData | null> {
    try {
      const solscanResponse = await fetch(`https://public-api.solscan.io/token/meta?tokenAddress=${this.props.tokenAddress}`);
      if (solscanResponse.ok) {
        const tokenData = await solscanResponse.json();
        
        if (tokenData) {
          return {
            name: tokenData.name || tokenData.symbol || 'Unknown Token',
            symbol: tokenData.symbol || '???',
            logoURI: tokenData.icon || null,
            decimals: tokenData.decimals || 9,
            price: null,
            priceChange24h: null,
            marketCap: null
          };
        }
      }
    } catch (error) {
      console.log('Solscan API error:', error);
    }
    return null;
  }

  // Méthode pour essayer l'API DexScreener pour prix et informations de marché
  async tryDexScreenerAPI(): Promise<TokenData | null> {
    try {
      const dexScreenerResponse = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${this.props.tokenAddress}`);
      if (dexScreenerResponse.ok) {
        const dexData = await dexScreenerResponse.json();
        
        if (dexData && dexData.pairs && dexData.pairs.length > 0) {
          // Trouver la paire avec le plus de liquidité
          const sortedPairs = [...dexData.pairs].sort((a, b) => {
            const liquidityA = parseFloat(a.liquidity?.usd || '0');
            const liquidityB = parseFloat(b.liquidity?.usd || '0');
            return liquidityB - liquidityA;
          });
          
          const bestPair = sortedPairs[0];
          
          return {
            name: bestPair.baseToken.name || null,
            symbol: bestPair.baseToken.symbol || null,
            logoURI: null, // DexScreener n'offre pas d'images de logo
            decimals: null,
            price: parseFloat(bestPair.priceUsd || '0') || null,
            priceChange24h: parseFloat(bestPair.priceChange.h24 || '0') || null,
            marketCap: parseFloat(bestPair.fdv || '0') || null
          };
        }
      }
    } catch (error) {
      console.log('DexScreener API error:', error);
    }
    return null;
  }

  // Méthode pour essayer l'API Birdeye pour les métadonnées de tokens récents
  async tryBirdeyeAPI(): Promise<TokenData | null> {
    try {
      const birdeyeResponse = await fetch(`https://public-api.birdeye.so/defi/token_overview?address=${this.props.tokenAddress}`, {
        headers: {
          'X-API-KEY': 'BIRDEYE_PUBLIC', // Clé publique gratuite
          'Accept': 'application/json'
        }
      });
      
      if (birdeyeResponse.ok) {
        const tokenData = await birdeyeResponse.json();
        
        if (tokenData && tokenData.success && tokenData.data) {
          const data = tokenData.data;
          return {
            name: data.name || null,
            symbol: data.symbol || null,
            logoURI: data.logoURI || null,
            decimals: data.decimals || 9,
            price: data.price || null,
            priceChange24h: data.priceChange24h || null,
            marketCap: data.marketCap || null
          };
        }
      }
    } catch (error) {
      console.log('Birdeye API error:', error);
    }
    return null;
  }

  // Méthode pour essayer l'API CoinGecko pour les informations de prix
  async tryCoinGeckoAPI(): Promise<TokenData | null> {
    try {
      // CoinGecko a des limitations de taux, utilisons directement l'API par contrat si possible
      const tokenResponse = await fetch(`https://api.coingecko.com/api/v3/coins/solana/contract/${this.props.tokenAddress}`, {
        headers: {
          'Accept': 'application/json',
          // Ajouter un User-Agent pour éviter d'être bloqué
          'User-Agent': 'TokenCard/1.0'
        }
      });
      
      // Si nous recevons une erreur 429 (Too Many Requests), attendons et réessayons
      if (tokenResponse.status === 429) {
        console.log('CoinGecko rate limit reached, waiting to retry');
        // Attendre 5 secondes
        await new Promise(resolve => setTimeout(resolve, 5000));
        return null;
      }
      
      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        
        const usdMarketData = tokenData.market_data?.current_price?.usd;
        const usdMarketCap = tokenData.market_data?.market_cap?.usd;
        const priceChange24h = tokenData.market_data?.price_change_percentage_24h;
        
        return {
          name: tokenData.name || null,
          symbol: tokenData.symbol ? tokenData.symbol.toUpperCase() : null,
          logoURI: tokenData.image?.large || tokenData.image?.small || null,
          decimals: 9, // CoinGecko ne fournit pas les décimales, donc on utilise la valeur par défaut
          price: usdMarketData || null,
          priceChange24h: priceChange24h || null,
          marketCap: usdMarketCap || null
        };
      } else if (tokenResponse.status !== 404) {
        // Si c'est une erreur autre que 404 (Not Found), log l'erreur
        console.log(`CoinGecko API error: ${tokenResponse.status}`);
      }
    } catch (error) {
      console.log('CoinGecko API error:', error);
    }
    return null;
  }

  // Méthode pour obtenir des données directement depuis la blockchain Solana
  async getSolanaOnChainData(): Promise<TokenData | null> {
    try {
      // On utilise l'API RPC de Solana pour obtenir les métadonnées du token
      const response = await fetch('https://api.mainnet-beta.solana.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "jsonrpc": "2.0",
          "id": 1,
          "method": "getAccountInfo",
          "params": [
            this.props.tokenAddress,
            {
              "encoding": "jsonParsed"
            }
          ]
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.result && data.result.value && data.result.value.data) {
          const accountData = data.result.value.data.parsed;
          
          if (accountData && accountData.info && accountData.info.mint) {
            // C'est un token SPL
            return {
              name: accountData.info.name || `Token ${this.props.tokenAddress.substring(0, 6)}`,
              symbol: accountData.info.symbol || 'SPL',
              logoURI: null,
              decimals: accountData.info.decimals || 9,
              price: null,
              priceChange24h: null,
              marketCap: null
            };
          }
        }
      }
    } catch (error) {
      console.log('Solana RPC error:', error);
    }
    return null;
  }

  // Fonction pour formater les montants en dollars
  formatUSD(amount: number | null): string {
    if (amount === null) return 'N/A';
    
    // Pour les gros nombres (market cap), utiliser des abréviations
    if (amount >= 1_000_000_000) {
      return `$${(amount / 1_000_000_000).toFixed(2)}B`;
    } else if (amount >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(2)}M`;
    } else if (amount >= 1_000) {
      return `$${(amount / 1_000).toFixed(2)}K`;
    }
    
    // Pour les petits nombres, afficher jusqu'à 6 décimales pour les cryptomonnaies à faible valeur
    if (amount < 0.01) {
      return `$${amount.toFixed(6)}`;
    }
    
    return `$${amount.toFixed(2)}`;
  }

  // Fonction pour ouvrir Solscan avec l'adresse du token
  openSolscan = () => {
    window.open(`https://solscan.io/token/${this.props.tokenAddress}`, '_blank');
  }

  render() {
    const { loading, tokenData, error } = this.state;
    const { tokenAddress } = this.props;

    if (error) {
      return (
        <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-red-800/60">
          <div className="text-red-400 text-sm">{error}</div>
          <div className="flex items-center space-x-4 mt-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600/50 to-purple-600/50 rounded-full flex items-center justify-center">
              <CircleDollarSign className="text-white/70" size={20} />
            </div>
            <div>
              <div className="text-xl font-bold text-white/70">{tokenData.name || 'Unknown Token'}</div>
              <div className="text-sm text-gray-400">{'$'}{tokenData.symbol || 'SPL'}</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-800/60">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-white">DAO Token</h3>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-24">
            <Loader className="animate-spin text-primary" size={24} />
          </div>
        ) : (
          <>
            <div className="flex items-start">
              {/* Logo du token à gauche */}
              <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden mr-4">
                {tokenData.logoURI ? (
                  <img 
                    src={tokenData.logoURI} 
                    alt={tokenData.name || 'Token logo'} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentNode as HTMLElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center">
                            <span class="text-white" style="font-size: 20px;">
                              ${tokenData.symbol?.substring(0, 1) || '$'}
                            </span>
                          </div>
                        `;
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <span className="text-white text-xl font-bold">
                      {tokenData.symbol?.substring(0, 1) || '$'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Informations du token à droite */}
              <div className="flex-1">
                {/* Première ligne: Nom du token à gauche et prix à droite */}
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-white">{tokenData.name || 'Unknown Token'}</div>
                  {tokenData.price !== null && (
                    <div className="text-lg font-medium text-white">
                      {this.formatUSD(tokenData.price)}
                    </div>
                  )}
                </div>
                
                {/* Deuxième ligne: Symbole du token à gauche et variation 24h à droite */}
                <div className="flex items-center justify-between mt-1">
                  <div className="text-sm text-gray-400">{'$'}{tokenData.symbol || 'SPL'}</div>
                  {tokenData.priceChange24h !== null && (
                    <div className={`flex items-center ${tokenData.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'} text-sm`}>
                      {tokenData.priceChange24h >= 0 ? (
                        <TrendingUp size={14} className="mr-1" />
                      ) : (
                        <TrendingDown size={14} className="mr-1" />
                      )}
                      <span>{Math.abs(tokenData.priceChange24h).toFixed(2)}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="bg-[#1A1A1A]/70 p-3 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-400">Contract</span>
                  <button 
                    onClick={this.openSolscan}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {`${tokenAddress.substring(0, 6)}...${tokenAddress.substring(tokenAddress.length - 4)}`}
                  </button>
                </div>
                {tokenData.marketCap !== null && (
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Market Cap</span>
                    <span className="text-xs text-white">{this.formatUSD(tokenData.marketCap)}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default TokenCard; 
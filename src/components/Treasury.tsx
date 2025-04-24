import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ArrowUp, 
  ArrowDown, 
  Loader,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { treasuryService } from '../services/TreasuryService';
import { Treasury as TreasuryType, Token } from '../core/modules/dao-api';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { containers, typography, ui } from '../styles/theme';
import Card from './common/Card';

// Define refresh interval (5 minutes)
const REFRESH_INTERVAL = 300000;

const Treasury = () => {
  const { daoId } = useParams<{ daoId: string }>();
  const [treasury, setTreasury] = useState<TreasuryType | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [calculatedTotalValue, setCalculatedTotalValue] = useState<number>(0);

  // Function to fetch all treasury data
  const fetchTreasuryData = async () => {
    if (!daoId) {
      setError('No DAO ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch treasury data
      const treasuryData = await treasuryService.getTreasury(daoId);
      setTreasury(treasuryData);
      
      // Fetch tokens from the DAO's treasury wallet
      const tokensData = await treasuryService.getTokens(daoId);
      setTokens(tokensData);
      
      setLastUpdated(new Date());
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching treasury data:', err);
      setError('Failed to load treasury data. Please try again.');
      setLoading(false);
    }
  };

  // Function to calculate total value based on token balances and prices
  const calculateTotalValue = (tokensData: Token[]): number => {
    return tokensData.reduce((total, token) => {
      // Only add to total if both balance and price are available
      if (token.balance !== undefined && token.price !== undefined) {
        return total + (token.balance * token.price);
      }
      return total;
    }, 0);
  };

  // Set up initial data load and refresh interval
  useEffectOnce(() => {
    fetchTreasuryData();
    
    // Set up automatic refresh
    const refreshInterval = setInterval(() => {
      fetchTreasuryData();
    }, REFRESH_INTERVAL);
    
    // Cleanup on unmount
    return () => clearInterval(refreshInterval);
  }, [daoId]);

  // Update calculated total value whenever tokens change
  useEffect(() => {
    const totalValue = calculateTotalValue(tokens);
    setCalculatedTotalValue(totalValue);
  }, [tokens]);

  // Format currency value with appropriate symbols and decimals
  const formatCurrency = (value: any): string => {
    if (value === null || value === undefined) return '$0';
    
    const numValue = Number(value);
    
    // Handle very small values with appropriate precision
    if (numValue > 0 && numValue < 0.000001) {
      return '$' + numValue.toExponential(4);
    } else if (numValue > 0 && numValue < 0.0001) {
      return '$' + numValue.toFixed(8);
    } else if (numValue > 0 && numValue < 0.01) {
      return '$' + numValue.toFixed(6);
    } else if (numValue > 0 && numValue < 1) {
      return '$' + numValue.toFixed(4);
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(numValue);
  };

  // Format the last updated time
  const formatLastUpdated = (): string => {
    if (!lastUpdated) return 'Never';
    
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(lastUpdated);
  };

  // Format token amounts with appropriate precision
  const formatTokenAmount = (amount: number | undefined): string => {
    if (amount === undefined || amount === null) return '0';
    
    if (amount < 0.01) {
      return amount.toFixed(6);
    } else if (amount < 1) {
      return amount.toFixed(4);
    } else if (amount < 1000) {
      return amount.toFixed(2);
    } else {
      return new Intl.NumberFormat('en-US').format(Number(amount.toFixed(2)));
    }
  };

  // Format percentage values
  const formatPercentage = (percent: number | undefined): string => {
    if (percent === undefined || percent === null) return '0%';
    return `${percent.toFixed(2)}%`;
  };

  // Format date for transactions
  const formatDate = (date: Date | undefined): string => {
    if (!date) return 'Unknown';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="p-6">
      {/* Error message display */}
      {error && (
        <Card className="mb-6">
          <div className="flex items-center text-red-400">
            <AlertCircle size={20} className="mr-2" />
            <p>{error}</p>
          </div>
        </Card>
      )}
      
      {/* Treasury overview header */}
      <div className="mb-6">
        <h1 className={typography.h1}>Treasury</h1>
      </div>
      
      {/* Treasury total value card */}
      <Card title="Total Balance" className="mb-6">
        {loading ? (
          <div className="flex items-center justify-center h-20">
            <Loader className="animate-spin text-purple-500" size={24} />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-end">
            <div className={ui.stat.value + " text-4xl mb-2 md:mb-0"}>
              {formatCurrency(calculatedTotalValue)}
            </div>
            {treasury?.dailyChange !== undefined && treasury?.dailyChange !== null && (
              <div className={`flex items-center md:ml-4 ${treasury.dailyChange >= 0 ? ui.stat.positive : ui.stat.negative}`}>
                {treasury.dailyChange >= 0 ? (
                  <ArrowUp className="h-5 w-5 mr-1" />
                ) : (
                  <ArrowDown className="h-5 w-5 mr-1" />
                )}
                <span>{formatCurrency(Math.abs(treasury.dailyChange))}</span>
                <span className="ml-1">
                  ({treasury.dailyChangePercentage !== undefined && treasury.dailyChangePercentage !== null 
                    ? `${treasury.dailyChangePercentage >= 0 ? '+' : ''}${treasury.dailyChangePercentage.toFixed(2)}%` 
                    : '0%'})
                </span>
              </div>
            )}
          </div>
        )}
      </Card>
      
      {/* Tokens section */}
      <Card title="Assets" className="mb-6">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader className="animate-spin text-purple-500" size={24} />
          </div>
        ) : tokens.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No tokens found in this treasury.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={ui.table.container}>
              <thead>
                <tr>
                  <th className={ui.table.header}>Token</th>
                  <th className={ui.table.header + " text-right"}>Balance</th>
                  <th className={ui.table.header + " text-right"}>Price</th>
                  <th className={ui.table.header + " text-right"}>24h</th>
                  <th className={ui.table.header + " text-right"}>Value</th>
                  <th className={ui.table.header + " text-right"}>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token: Token) => (
                  <tr key={token.tokenId} className={ui.table.row}>
                    <td className={ui.table.cell}>
                      <div className="flex items-center">
                        {token.photoUrl ? (
                          <img 
                            src={token.photoUrl} 
                            alt={token.symbol || 'Token'} 
                            className="h-8 w-8 rounded-full mr-3 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = ''; // Remove src to prevent further errors
                              // Replace with fallback div
                              target.style.display = 'none';
                              const parent = target.parentNode as HTMLElement;
                              const fallback = document.createElement('div');
                              fallback.className = 'h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3';
                              fallback.innerHTML = token.symbol ? token.symbol.substring(0, 1) : 'T';
                              parent.insertBefore(fallback, target);
                            }}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                            {token.symbol ? token.symbol.substring(0, 1) : 'T'}
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{token.symbol || 'Unknown Token'}</div>
                          <div className="text-gray-400 text-xs"><a href={`http://dexscreener.com/solana/${token.tokenMint}`} target="_blank" rel="noopener noreferrer">{token.tokenMint || ''}</a></div>
                        </div>
                      </div>
                    </td>
                    <td className={ui.table.cell + " text-right"}>
                      {formatTokenAmount(token.balance)}
                    </td>
                    <td className={ui.table.cell + " text-right"}>
                      {token.price !== undefined ? formatCurrency(token.price) : 'N/A'}
                    </td>
                    <td className={ui.table.cell + " text-right"}>
                      {token.priceChangePercentage !== undefined ? (
                        <span className={token.priceChangePercentage >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {token.priceChangePercentage >= 0 ? '+' : ''}
                          {formatPercentage(token.priceChangePercentage)}
                        </span>
                      ) : 'N/A'}
                    </td>
                    <td className={ui.table.cell + " text-right font-medium"}>
                      {(token.balance !== undefined && token.price !== undefined) 
                        ? formatCurrency(token.balance * token.price) 
                        : 'N/A'}
                    </td>
                    <td className={ui.table.cell + " text-right"}>
                      {token.lastUpdated ? formatDate(token.lastUpdated) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {/* Last updated text - centered under Assets */}
      <div className="text-center text-gray-400 text-sm">
        Last updated: {formatLastUpdated()}
      </div>
      
      {/* Explorer link */}
      <div className="text-center mt-2">
        <a 
          href={`https://solscan.io/account/${daoId}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-purple-500 hover:text-purple-400 transition-colors inline-flex items-center gap-1 text-sm"
        >
          <span>See on Explorer</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};

export default Treasury;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  CircleDollarSign, 
  ArrowDownUp, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw, 
  Loader,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { treasuryService } from '../services/TreasuryService';
import { Treasury as TreasuryType, Token, Transfer } from '../core/modules/dao-api';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { containers, typography, ui, utils } from '../styles/theme';
import Card from './common/Card';
import Button from './common/Button';
import Badge from './common/Badge';

// Define refresh interval (5 minutes)
const REFRESH_INTERVAL = 300000;

const Treasury = () => {
  const { daoId } = useParams<{ daoId: string }>();
  const [treasury, setTreasury] = useState<TreasuryType | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Function to fetch all treasury data
  const fetchTreasuryData = async (showRefreshIndicator = true) => {
    if (!daoId) {
      setError('No DAO ID provided');
      setLoading(false);
      return;
    }

    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Fetch treasury data
      const treasuryData = await treasuryService.getTreasury(daoId);
      setTreasury(treasuryData);
      
      // Fetch tokens
      const tokensData = await treasuryService.getTokens(daoId);
      setTokens(tokensData);
      
      // Fetch transfers
      const transfersData = await treasuryService.getTransfers(daoId);
      setTransfers(transfersData);
      
      setLastUpdated(new Date());
      setRefreshing(false);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching treasury data:', err);
      setError('Failed to load treasury data. Please try again.');
      setRefreshing(false);
      setLoading(false);
    }
  };

  // Function to refresh data manually
  const handleRefresh = () => {
    fetchTreasuryData(true);
  };

  // Set up initial data load and refresh interval
  useEffectOnce(() => {
    fetchTreasuryData();
    
    // Set up automatic refresh
    const refreshInterval = setInterval(() => {
      fetchTreasuryData(false);
    }, REFRESH_INTERVAL);
    
    // Cleanup on unmount
    return () => clearInterval(refreshInterval);
  }, [daoId]);

  // Format currency value with appropriate symbols and decimals
  const formatCurrency = (value: any): string => {
    if (value === null || value === undefined) return '$0';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(Number(value));
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

  // Shorten wallet addresses for display
  const shortenAddress = (address: string): string => {
    if (!address) return 'Unknown';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
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
      
      {/* Treasury overview header with refresh button */}
      <div className={containers.flexBetween + " mb-6"}>
        <h1 className={typography.h1}>Treasury</h1>
        <Button 
          variant="secondary" 
          onClick={handleRefresh} 
          disabled={refreshing}
          leftIcon={refreshing ? <Loader className="animate-spin" size={16} /> : <RefreshCw size={16} />}
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      <p className={typography.small + " mb-6"}>
        Last updated: {formatLastUpdated()}
      </p>
      
      {/* Treasury total value card */}
      <Card title="Total Balance" className="mb-6">
        {loading ? (
          <div className="flex items-center justify-center h-20">
            <Loader className="animate-spin text-purple-500" size={24} />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-end">
            <div className={ui.stat.value + " text-4xl mb-2 md:mb-0"}>
              {formatCurrency(treasury?.totalValue)}
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
                  <th className={ui.table.header + " text-right"}>Value</th>
                  <th className={ui.table.header + " text-right"}>% of Treasury</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token) => (
                  <tr key={token.tokenId} className={ui.table.row}>
                    <td className={ui.table.cell}>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                          {token.symbol ? token.symbol.substring(0, 1) : 'T'}
                        </div>
                        <div>
                          <div className="font-medium">{token.name || token.symbol}</div>
                          <div className="text-gray-400 text-xs">{token.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className={ui.table.cell + " text-right"}>
                      {formatTokenAmount(token.amount)}
                    </td>
                    <td className={ui.table.cell + " text-right"}>
                      {formatCurrency(token.price)}
                    </td>
                    <td className={ui.table.cell + " text-right"}>
                      {formatCurrency(token.value)}
                    </td>
                    <td className={ui.table.cell + " text-right"}>
                      {formatPercentage(token.percentage)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {/* Transactions section */}
      <Card title="Recent Transactions" className="mb-6">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader className="animate-spin text-purple-500" size={24} />
          </div>
        ) : transfers.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={ui.table.container}>
              <thead>
                <tr>
                  <th className={ui.table.header}>Transaction</th>
                  <th className={ui.table.header}>Token</th>
                  <th className={ui.table.header + " text-right"}>Amount</th>
                  <th className={ui.table.header + " text-right"}>Date</th>
                  <th className={ui.table.header + " text-right"}>Explorer</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((transfer, index) => (
                  <tr key={transfer.transferId || index} className={ui.table.row}>
                    <td className={ui.table.cell}>
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-3 ${transfer.direction === 'in' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                          <ArrowDownUp 
                            size={16} 
                            className={transfer.direction === 'in' ? 'text-green-400' : 'text-red-400'} 
                          />
                        </div>
                        <div>
                          <div className="font-medium">
                            {transfer.direction === 'in' ? 'Deposit' : 'Withdrawal'}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {transfer.direction === 'in' 
                              ? `From: ${shortenAddress(transfer.fromAddress || '')}` 
                              : `To: ${shortenAddress(transfer.toAddress || '')}`
                            }
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={ui.table.cell}>
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center mr-2 text-xs">
                          {transfer.token?.symbol ? transfer.token.symbol.substring(0, 1) : 'T'}
                        </div>
                        <span>{transfer.token?.symbol || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className={ui.table.cell + " text-right font-medium"}>
                      <span className={transfer.direction === 'in' ? 'text-green-400' : 'text-red-400'}>
                        {transfer.direction === 'in' ? '+' : '-'}{formatTokenAmount(transfer.amount)}
                      </span>
                    </td>
                    <td className={ui.table.cell + " text-right text-gray-400"}>
                      {formatDate(transfer.timestamp)}
                    </td>
                    <td className={ui.table.cell + " text-right"}>
                      {transfer.explorerUrl && (
                        <a 
                          href={transfer.explorerUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-400 hover:text-blue-300 inline-flex items-center"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Treasury; 
import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  Loader,
  AlertCircle,
  Info
} from 'lucide-react';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { typography, ui } from '../styles/theme';
import Card from './common/Card';
import { daosService } from '../services/DaosService';
import TradingViewWidget from './TradingViewWidget';

const Chart: React.FC = () => {
  const { daoId } = useParams<{ daoId: string }>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [tokenSymbol, setTokenSymbol] = React.useState<string | null>(null);
  const [tokenAddress, setTokenAddress] = React.useState<string | null>(null);
  // Using SOL as default trading symbol for now
  const tradingViewSymbol = "BINANCE:SOLUSDT";

  // Function to fetch token data for the current DAO
  const fetchTokenData = async () => {
    if (!daoId) {
      setError('No DAO ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch DAO data to get token information
      const daoData = await daosService.getDaoById(daoId);
      
      if (daoData && daoData.tokenAddress) {
        setTokenAddress(daoData.tokenAddress);
        // Since tokenSymbol is not in the DAO model, we'll use a placeholder or derive it
        setTokenSymbol(daoData.name || 'Unknown Token');
      } else {
        setError('No token associated with this DAO');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching token data:', err);
      setError('Failed to load token data. Please try again.');
      setLoading(false);
    }
  };

  // Set up initial data load
  useEffectOnce(() => {
    fetchTokenData();
  }, [daoId]);

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
      
      {/* Chart page header */}
      <div className="mb-6">
        <h1 className={typography.h1}>Token Chart</h1>
        {tokenSymbol && tokenAddress && (
          <p className="text-gray-400 mt-2">
            {tokenSymbol} ({tokenAddress.substring(0, 8)}...{tokenAddress.substring(tokenAddress.length - 8)})
          </p>
        )}
      </div>
      
      {/* Chart */}
      <Card title="Price Chart" className="mb-6">
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <Loader className="animate-spin text-purple-500" size={24} />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-80 text-gray-400">
            <AlertCircle size={40} className="mb-4" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="relative h-80">
            <TradingViewWidget symbol={tradingViewSymbol} />
          </div>
        )}
      </Card>
      
      {/* Token information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card title="Market Information">
          <div className="p-4">
            <div className="flex items-center justify-center h-40 text-gray-400">
              <div className="flex flex-col items-center">
                <Info size={40} className="mb-4" />
                <p>Token market data will be available here</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card title="Trading History">
          <div className="p-4">
            <div className="flex items-center justify-center h-40 text-gray-400">
              <div className="flex flex-col items-center">
                <Info size={40} className="mb-4" />
                <p>Trading history will be available here</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Note about temporary symbol */}
      <div className="text-center text-gray-400 text-sm mt-4">
        <p>Note: Currently showing SOL chart as an example. Future updates will display the actual token chart.</p>
      </div>
    </div>
  );
};

export default Chart; 
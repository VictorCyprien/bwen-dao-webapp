import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  Loader,
  AlertCircle
} from 'lucide-react';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { typography } from '../styles/theme';
import Card from './common/Card';
import { daosService } from '../services/DaosService';

const Chart: React.FC = () => {
  const { daoId } = useParams<{ daoId: string }>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [tokenSymbol, setTokenSymbol] = React.useState<string | null>(null);
  const [tokenAddress, setTokenAddress] = React.useState<string | null>(null);
  const [pairAddress, setPairAddress] = React.useState<string | null>(null);

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
        
        // Now fetch the pair address from Dexscreener
        await fetchPairAddress(daoData.tokenAddress);
      } else {
        setError('No token associated with this DAO');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching token data:', err);
      setError('Failed to load token data. Please try again.');
      setLoading(false);
    }
  };

  // Function to fetch pair address from Dexscreener API
  const fetchPairAddress = async (tokenAddress: string) => {
    try {
      const response = await fetch(`https://api.dexscreener.com/tokens/v1/solana/${tokenAddress}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Get the first pair from the response
        const pairAddress = data[0].pairAddress;
        console.log(pairAddress);
        setPairAddress(pairAddress);
      } else {
        setError('No trading pairs found for this token');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching pair data:', err);
      setError('Failed to load trading pair data. Please try again.');
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
        ) : pairAddress ? (
          <div className="relative overflow-hidden" style={{ height: '700px' }}>
            <iframe 
              id="dextools-widget"
              title="DEXTools Trading Chart"
              width="100%" 
              height="700"
              src={`https://www.dextools.io/widget-chart/en/solana/pe-light/${pairAddress}?theme=dark&chartType=1&chartResolution=30&drawingToolbars=true`}
              className="border-0"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-80 text-gray-400">
            <AlertCircle size={40} className="mb-4" />
            <p>No trading pair found for this token</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Chart; 
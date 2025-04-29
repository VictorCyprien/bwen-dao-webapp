import { RefreshCw } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Token } from '../core/modules/dao-api';

interface TreasuryAssetsCardProps {
  tokens: Token[];
  refreshing: boolean;
}

const TreasuryAssetsCard = ({ tokens, refreshing }: TreasuryAssetsCardProps) => {
  // Format currency value
  const formatCurrency = (value: any): string => {
    if (value === null || value === undefined) return '$0';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(Number(value));
  };

  // Chart helper functions
  const createDonutChartData = (items: Token[]) => {
    if (!items || items.length === 0) return null;
    
    // Sort tokens by value (balance * price) in descending order
    const sortedTokens = [...items].sort((a, b) => {
      const valueA = a.balance && a.price ? a.balance * a.price : 0;
      const valueB = b.balance && b.price ? b.balance * b.price : 0;
      return valueB - valueA;
    });
    
    // Take top 5 tokens and calculate their values
    const top5Tokens = sortedTokens.slice(0, 5);
    const otherTokens = sortedTokens.slice(5);
    
    // Calculate total value of "Other" tokens
    const otherValue = otherTokens.reduce((sum, token) => {
      return sum + (token.balance && token.price ? token.balance * token.price : 0);
    }, 0);
    
    let labels = top5Tokens.map((token) => token.symbol || 'Unknown');
    let data = top5Tokens.map((token) => 
      token.balance && token.price ? token.balance * token.price : 0
    );
    
    // Add "Other" category if there are more than 5 tokens
    if (otherTokens.length > 0) {
      labels.push('Other');
      data.push(otherValue);
    }
    
    const backgroundColor = [
      '#7C3AED', '#4F46E5', '#2563EB', '#0EA5E9', '#06B6D4',
      '#FFFFFF' // Color for "Other"
    ];
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColor.slice(0, labels.length),
          borderWidth: 0,
        },
      ],
    };
  };

  return (
    <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-800/60">
      <div className="mb-3">
        <h2 className="font-medium text-white">Treasury Assets</h2>
      </div>
      
      <div className="p-2">
        {refreshing ? (
          <div className="flex items-center justify-center h-40">
            <RefreshCw className="animate-spin h-8 w-8 text-gray-400" />
          </div>
        ) : tokens.length === 0 ? (
          <div className="text-center text-gray-400 p-10">
            No assets detected yet
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
            {/* Chart on the left */}
            <div className="w-full md:w-1/2 md:pr-4 mb-4 md:mb-0">
              <div className="w-40 h-40 mx-auto">
                <Doughnut 
                  data={createDonutChartData(tokens) as any} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    cutout: '70%'
                  }} 
                />
              </div>
            </div>
            
            {/* Labels on the right */}
            <div className="w-full md:w-1/2 md:pl-4">
              <div className="grid grid-cols-1 gap-2">
                {tokens.length > 0 && (
                  <>
                    {/* Sort tokens by value and take top 5 */}
                    {[...tokens]
                      .sort((a, b) => {
                        const valueA = a.balance && a.price ? a.balance * a.price : 0;
                        const valueB = b.balance && b.price ? b.balance * b.price : 0;
                        return valueB - valueA;
                      })
                      .slice(0, 5)
                      .map((token, index) => (
                        <div key={token.tokenId || index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div 
                              className="h-3 w-3 rounded-sm mr-2" 
                              style={{ backgroundColor: ['#7C3AED', '#4F46E5', '#2563EB', '#0EA5E9', '#06B6D4'][index % 5] }}
                            ></div>
                            <span className="text-sm text-gray-300">{token.symbol || 'Unknown'}</span>
                          </div>
                          <span className="text-sm text-gray-300">
                            {formatCurrency(token.balance ? token.balance * (token.price || 0) : 0)}
                          </span>
                        </div>
                      ))
                    }
                    
                    {/* Show "Other" category if more than 5 tokens exist */}
                    {tokens.length > 5 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-sm mr-2" style={{ backgroundColor: '#14B8A6' }}></div>
                          <span className="text-sm text-gray-300">Other</span>
                        </div>
                        <span className="text-sm text-gray-300">
                          {formatCurrency(
                            [...tokens]
                              .sort((a, b) => {
                                const valueA = a.balance && a.price ? a.balance * a.price : 0;
                                const valueB = b.balance && b.price ? b.balance * b.price : 0;
                                return valueB - valueA;
                              })
                              .slice(5)
                              .reduce((sum, token) => sum + (token.balance && token.price ? token.balance * token.price : 0), 0)
                          )}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreasuryAssetsCard; 
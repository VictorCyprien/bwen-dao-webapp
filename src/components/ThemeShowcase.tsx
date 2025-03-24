import React, { useState } from 'react';
import { containers, typography, ui, utils } from '../styles/theme';
import Card from './common/Card';
import Button from './common/Button';
import Badge from './common/Badge';
import { 
  Wallet, Bell, User, Settings, ArrowRight, ChevronRight, 
  Check, X, AlertCircle, Info, Home, Search, Plus
} from 'lucide-react';

const ThemeShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('components');

  return (
    <div className="p-6">
      <h1 className={typography.h1}>Design System Showcase</h1>
      <p className={typography.body + ' mt-2 mb-6'}>
        A comprehensive view of all design components and patterns available in our unified design system.
      </p>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-gray-800/60 pb-4">
        <Button 
          variant={activeTab === 'components' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('components')}
        >
          Components
        </Button>
        <Button 
          variant={activeTab === 'typography' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('typography')}
        >
          Typography
        </Button>
        <Button 
          variant={activeTab === 'layouts' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('layouts')}
        >
          Layouts
        </Button>
        <Button 
          variant={activeTab === 'utilities' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('utilities')}
        >
          Utilities
        </Button>
      </div>

      {activeTab === 'components' && (
        <div className="space-y-8">
          {/* Buttons Showcase */}
          <Card title="Buttons">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col space-y-4">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
              </div>
              
              <div className="flex flex-col space-y-4">
                <Button variant="primary" leftIcon={<Plus size={16} />}>With Left Icon</Button>
                <Button variant="secondary" rightIcon={<ArrowRight size={16} />}>With Right Icon</Button>
                <Button variant="outline" isLoading={true}>Loading State</Button>
              </div>
              
              <div className="flex flex-col space-y-4">
                <Button variant="primary" size="sm">Small Size</Button>
                <Button variant="primary" size="md">Medium Size</Button>
                <Button variant="primary" size="lg">Large Size</Button>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <Button variant="icon" aria-label="Settings">
                <Settings size={18} />
              </Button>
              <Button variant="icon" aria-label="Notifications">
                <Bell size={18} />
              </Button>
              <Button variant="icon" aria-label="Profile">
                <User size={18} />
              </Button>
              <Button variant="menu">
                <User size={16} className="mr-2" />
                <span>Menu Button</span>
                <ChevronRight size={16} className="ml-2" />
              </Button>
              <Button variant="vote">Vote Now</Button>
            </div>
          </Card>

          {/* Cards Showcase */}
          <Card title="Cards">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Standard Card" className="h-full">
                <p className="text-sm text-gray-300">
                  This is a standard card with default styling.
                </p>
              </Card>
              
              <Card 
                title="Card with Footer" 
                footer={
                  <div className="flex justify-between w-full">
                    <span className="text-xs text-gray-400">Last updated: 2 days ago</span>
                    <Button variant="primary" size="sm">Action</Button>
                  </div>
                }
              >
                <p className="text-sm text-gray-300">
                  This card includes a footer with actions.
                </p>
              </Card>
              
              <Card 
                title="Card with Right Element"
                rightElement={<Badge variant="primary">New</Badge>}
              >
                <p className="text-sm text-gray-300">
                  This card has an element in the right side of the header.
                </p>
              </Card>
              
              <Card highlight={true}>
                <p className="text-sm text-gray-300">
                  This is a highlighted card that stands out more.
                </p>
              </Card>
            </div>
          </Card>

          {/* Badges Showcase */}
          <Card title="Badges">
            <div className="flex flex-wrap gap-4">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="neutral">Neutral</Badge>
              
              <Badge variant="primary">
                <Check size={12} className="mr-1" />
                With Icon
              </Badge>
              
              <Badge variant="warning">
                <AlertCircle size={12} className="mr-1" />
                Alert
              </Badge>
            </div>
          </Card>

          {/* Stats Showcase */}
          <Card title="Stats">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <span className={typography.label}>Total Members</span>
                <span className={ui.stat.value}>1,254</span>
              </div>
              
              <div className="flex flex-col">
                <span className={typography.label}>Portfolio Value</span>
                <span className={ui.stat.value}>$10,750,000</span>
                <span className={ui.stat.positive}>+24% this month</span>
              </div>
              
              <div className="flex flex-col">
                <span className={typography.label}>Token Price</span>
                <span className={ui.stat.value}>$2.87</span>
                <span className={ui.stat.negative}>-3.2% (24h)</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'typography' && (
        <Card title="Typography">
          <div className="space-y-6">
            <div>
              <h1 className={typography.h1}>Heading 1</h1>
              <p className="text-xs text-gray-400 mt-1">typography.h1</p>
            </div>
            
            <div>
              <h2 className={typography.h2}>Heading 2</h2>
              <p className="text-xs text-gray-400 mt-1">typography.h2</p>
            </div>
            
            <div>
              <h3 className={typography.h3}>Heading 3</h3>
              <p className="text-xs text-gray-400 mt-1">typography.h3</p>
            </div>
            
            <div>
              <h4 className={typography.h4}>Heading 4</h4>
              <p className="text-xs text-gray-400 mt-1">typography.h4</p>
            </div>
            
            <div>
              <p className={typography.body}>
                This is body text. It's used for paragraphs and general content. 
                The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-xs text-gray-400 mt-1">typography.body</p>
            </div>
            
            <div>
              <p className={typography.small}>
                This is small text, typically used for captions, labels, and secondary information.
              </p>
              <p className="text-xs text-gray-400 mt-1">typography.small</p>
            </div>
            
            <div>
              <p className={typography.label}>Form label text</p>
              <p className="text-xs text-gray-400 mt-1">typography.label</p>
            </div>
            
            <div>
              <p className={typography.gradient}>This text has a gradient effect</p>
              <p className="text-xs text-gray-400 mt-1">typography.gradient</p>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'layouts' && (
        <div className="space-y-6">
          <Card title="Grid Layouts">
            <div className={containers.grid}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-[#1A1A1A] p-4 rounded-lg text-center">
                  Grid Item {i}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">containers.grid</p>
          </Card>
          
          <Card title="Two-Thirds / One-Third Layout">
            <div className={containers.gridTwoThirdsOneThird}>
              <div className="bg-[#1A1A1A] p-4 rounded-lg col-span-2">
                Two-Thirds Width
              </div>
              <div className="bg-[#1A1A1A] p-4 rounded-lg">
                One-Third Width
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">containers.gridTwoThirdsOneThird</p>
          </Card>
          
          <Card title="Flex Layouts">
            <div className="space-y-4">
              <div>
                <div className={containers.flexBetween + " bg-[#1A1A1A] p-4 rounded-lg"}>
                  <div>Left Content</div>
                  <div>Right Content</div>
                </div>
                <p className="text-xs text-gray-400 mt-2">containers.flexBetween</p>
              </div>
              
              <div>
                <div className={containers.flexCenter + " bg-[#1A1A1A] p-4 rounded-lg h-24"}>
                  <div>Centered Content</div>
                </div>
                <p className="text-xs text-gray-400 mt-2">containers.flexCenter</p>
              </div>
              
              <div>
                <div className={containers.flexColumn + " bg-[#1A1A1A] p-4 rounded-lg h-32"}>
                  <div>Item 1</div>
                  <div>Item 2</div>
                  <div>Item 3</div>
                </div>
                <p className="text-xs text-gray-400 mt-2">containers.flexColumn</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'utilities' && (
        <div className="space-y-6">
          <Card title="Glassmorphism">
            <div className="relative h-40 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"></div>
              <div className={`${utils.glassmorphism} absolute inset-0 m-4 rounded-lg p-4`}>
                <h3 className="text-white font-medium mb-2">Glassmorphism Effect</h3>
                <p className="text-sm text-gray-300">
                  This element has a backdrop blur and semi-transparent background.
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">utils.glassmorphism</p>
          </Card>
          
          <Card title="Text Utilities">
            <div className="space-y-4">
              <div>
                <div className={`${utils.truncate} bg-[#1A1A1A] p-4 rounded-lg w-64`}>
                  This is a very long text that will be truncated because it exceeds the width of its container.
                </div>
                <p className="text-xs text-gray-400 mt-2">utils.truncate</p>
              </div>
              
              <div>
                <div className={`${utils.hoverHighlight} bg-[#1A1A1A] p-4 rounded-lg`}>
                  Hover over me to see the highlight effect.
                </div>
                <p className="text-xs text-gray-400 mt-2">utils.hoverHighlight</p>
              </div>
              
              <div>
                <div className={`${utils.shadow} bg-[#1A1A1A] p-4 rounded-lg`}>
                  This element has a shadow effect.
                </div>
                <p className="text-xs text-gray-400 mt-2">utils.shadow</p>
              </div>
            </div>
          </Card>
          
          <Card title="Gradients">
            <div className="grid grid-cols-3 gap-4">
              <div className={`${ui.gradients.purple} h-20 rounded-lg flex items-center justify-center text-white`}>
                Purple Gradient
              </div>
              <div className={`${ui.gradients.blue} h-20 rounded-lg flex items-center justify-center text-white`}>
                Blue Gradient
              </div>
              <div className={`${ui.gradients.green} h-20 rounded-lg flex items-center justify-center text-white`}>
                Green Gradient
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ThemeShowcase; 
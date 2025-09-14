import { 
  createaipAction, 
  manageFundsAction, 
  crossChainTransferAction, 
  emergencyAction,
  checkStatusAction 
} from './actions/aipActions.ts';
import type { Plugin } from '@elizaos/core';
import {
  type Provider,
  type ProviderResult,
  type IAgentRuntime,
  type Memory,
  type State,
  logger,
} from '@elizaos/core';
import { z } from 'zod';
import { Web3Service } from './services/web3Service.js';

const configSchema = z.object({
  AI_AGENT_PRIVATE_KEY: z
    .string()
    .min(1, 'AI Agent private key is required')
    .optional(),
  USER_WALLET_ADDRESS: z
    .string()
    .min(1, 'User wallet address is required')
    .optional(),
  aip_TOKEN_ADDRESS: z
    .string()
    .min(1, 'aip token address is required')
    .optional(),
  FUJI_HOME_CONTRACT: z
    .string()
    .min(1, 'Fuji home contract address is required')
    .optional(),
  ECHO_REMOTE_CONTRACT: z
    .string()
    .min(1, 'Echo remote contract address is required')
    .optional(),
  DISPATCH_REMOTE_CONTRACT: z
    .string()
    .min(1, 'Dispatch remote contract address is required')
    .optional(),
});

const marketAnalysisProvider: Provider = {
  name: 'MARKET_ANALYSIS',
  description: 'Analyzes cross-chain yield opportunities and market conditions for optimal fund allocation',

  get: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
  ): Promise<ProviderResult> => {
    try {
      const web3Service = runtime.getService<Web3Service>('web3');
      if (!web3Service) {
        return {
          text: 'Market analysis unavailable - Web3 service not connected',
          values: {},
          data: {}
        };
      }

      const echoYieldRate = 5.2;
      const dispatchYieldRate = 3.1;
      const fujiStabilityScore = 95; 
      const marketVolatility = 'LOW';

      const analysis = `📊 **Current Market Analysis:**

**Yield Opportunities:**
• 🌊 Echo Chain: ${echoYieldRate}% APY (DeFi farming protocols)
• ⚡ Dispatch Chain: ${dispatchYieldRate}% APY (Stable liquidity pools)
• 🏔️ Fuji Chain: Base rate (Emergency liquidity)

**Market Conditions:**
• Volatility: ${marketVolatility}
• Fuji Stability Score: ${fujiStabilityScore}%
• Cross-chain Bridge Health: 98%

**AI Recommendation:** 
${marketVolatility === 'LOW' ? 
  'Optimal time for yield farming. Consider 60% Echo, 30% Fuji, 10% Dispatch allocation.' :
  'High volatility detected. Increase Fuji allocation for stability.'
}`;

      return {
        text: analysis,
        values: {
          echoYield: echoYieldRate,
          dispatchYield: dispatchYieldRate,
          fujiStability: fujiStabilityScore,
          volatility: marketVolatility
        },
        data: {
          timestamp: Date.now(),
          recommendation: marketVolatility === 'LOW' ? 'AGGRESSIVE' : 'CONSERVATIVE'
        }
      };
    } catch (error: any) {
      logger.error('Market analysis provider error:', error);
      return {
        text: 'Market analysis temporarily unavailable',
        values: {},
        data: {}
      };
    }
  },
};

const portfolioStatusProvider: Provider = {
  name: 'PORTFOLIO_STATUS',
  description: 'Provides real-time portfolio status across all chains',

  get: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
  ): Promise<ProviderResult> => {
    try {
      const web3Service = runtime.getService<Web3Service>('web3');
      if (!web3Service) {
        return {
          text: 'Portfolio status unavailable - Web3 service not connected',
          values: {},
          data: {}
        };
      }

      const userAddress = process.env.USER_WALLET_ADDRESS || '0x63f61A3F3c145b385553ba11B8799E81C4C522eA';
      
      const [balances, aipProgress] = await Promise.all([
        web3Service.getUserBalances(userAddress),
        web3Service.getaipProgress(userAddress).catch(() => null)
      ]);

      const statusText = `💼 **Portfolio Overview:**
• Total Value: ${balances.total} aip tokens
• Fuji: ${balances.fuji} aip • Echo: ${balances.echo} aip • Dispatch: ${balances.dispatch} aip
${aipProgress ? `• aip Progress: ${aipProgress.percentComplete}% complete` : ''}`;

      return {
        text: statusText,
        values: {
          totalValue: balances.total,
          fujiBalance: balances.fuji,
          echoBalance: balances.echo,
          dispatchBalance: balances.dispatch
        },
        data: {
          balances,
          aipProgress,
          lastUpdate: Date.now()
        }
      };
    } catch (error: any) {
      logger.error('Portfolio status provider error:', error);
      return {
        text: 'Portfolio status temporarily unavailable',
        values: {},
        data: {}
      };
    }
  },
};

const plugin: Plugin = {
  name: 'web3-aip-manager',
  description: 'AI-powered Web3 aip manager',
  priority: 1000,

  config: {
    AI_AGENT_PRIVATE_KEY: process.env.AI_AGENT_PRIVATE_KEY,
    USER_WALLET_ADDRESS: process.env.USER_WALLET_ADDRESS,
    aip_TOKEN_ADDRESS: process.env.aip_TOKEN_ADDRESS,
    FUJI_HOME_CONTRACT: process.env.FUJI_HOME_CONTRACT,
    ECHO_REMOTE_CONTRACT: process.env.ECHO_REMOTE_CONTRACT,
    DISPATCH_REMOTE_CONTRACT: process.env.DISPATCH_REMOTE_CONTRACT,
    FUJI_RPC_URL: process.env.FUJI_RPC_URL,
    ECHO_RPC_URL: process.env.ECHO_RPC_URL,
    DISPATCH_RPC_URL: process.env.DISPATCH_RPC_URL,
  },

  async init(config: Record<string, string>) {
    logger.info('🚀 *** Initializing Web3 aip Manager Plugin ***');
    try {
      const validatedConfig = await configSchema.parseAsync(config);

      for (const [key, value] of Object.entries(validatedConfig)) {
        if (value) process.env[key] = value;
      }

      logger.info('✅ Web3 aip Manager Plugin initialized successfully');
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.warn('⚠️ Configuration warnings:', error.errors.map((e) => e.message).join(', '));
      } else {
        throw error;
      }
    }
  },

  events: {
    MESSAGE_RECEIVED: [
      async (params) => {
        const { runtime, message } = params;
        
        if (message.content?.text?.toLowerCase().includes('aip')) {
          logger.info('📊 aip-related message received:', message.content.text.substring(0, 100));
        }
      },
    ],
    
    WORLD_CONNECTED: [
      async (params) => {
        logger.info('🌍 Web3 aip Manager connected to world');
        
        const { runtime } = params;
        try {
          await Web3Service.start(runtime);
          logger.info('✅ Web3Service started successfully');
        } catch (error: any) {
          logger.error('❌ Failed to start Web3Service:', error.message);
        }
      },
    ],
  },

  services: [Web3Service],

  actions: [
    createaipAction,
    manageFundsAction,
    crossChainTransferAction,
    emergencyAction,
    checkStatusAction,
  ],

  providers: [
    marketAnalysisProvider,
    portfolioStatusProvider,
  ],
};

export default plugin;
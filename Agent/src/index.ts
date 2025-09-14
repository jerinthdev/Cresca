import { logger, type IAgentRuntime, type Project, type ProjectAgent } from '@elizaos/core';
import web3aipPlugin from './plugin.ts';
import { character } from './character.ts';

const initCharacter = async (runtime: IAgentRuntime): Promise<void> => {
  logger.info('🚀 *** Initializing aip Manager AI Character ***');
  logger.info(`📝 Character Name: ${character.name}`);
  logger.info('🔧 Capabilities: Web3 aip Management, Cross-Chain Transfers, Automated Investing');
  
  // Display Web3 configuration status
  logger.info('🌐 *** Web3 Configuration Status ***');
  
  const requiredEnvVars = [
    'AI_AGENT_PRIVATE_KEY',
    'USER_WALLET_ADDRESS', 
    'aip_TOKEN_ADDRESS',
    'FUJI_HOME_CONTRACT',
    'ECHO_REMOTE_CONTRACT',
    'DISPATCH_REMOTE_CONTRACT'
  ];
  
  const configuredVars = requiredEnvVars.filter(varName => process.env[varName]);
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    logger.warn(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
    logger.warn('🔄 Some Web3 features may not work correctly');
  } else {
    logger.info('✅ All required Web3 environment variables configured');
  }
  
  logger.info('🌐 *** Network Configuration ***');
  logger.info(`   • AI Agent Wallet: ${process.env.AI_AGENT_PRIVATE_KEY ? '✅ Configured' : '❌ Missing'}`);
  logger.info(`   • User Address: ${process.env.USER_WALLET_ADDRESS || 'Using default demo address'}`);
  logger.info(`   • aip Token: ${process.env.aip_TOKEN_ADDRESS || '0x4Ea92Ee7211aE6a9c5b5DDf10708509CE4c6c367'}`);
  logger.info(`   • Fuji Home: ${process.env.FUJI_HOME_CONTRACT || '0x7CBC5bAd1aBbd269cC7b988422791F0586896cF3'}`);
  logger.info(`   • Echo Remote: ${process.env.ECHO_REMOTE_CONTRACT || '0x7CBC5bAd1aBbd269cC7b988422791F0586896cF3'}`);
  logger.info(`   • Dispatch Remote: ${process.env.DISPATCH_REMOTE_CONTRACT || '0x4Ea92Ee7211aE6a9c5b5DDf10708509CE4c6c367'}`);
  
  logger.info('🔗 *** RPC Endpoints ***');
  logger.info(`   • Fuji RPC: ${process.env.FUJI_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc'}`);
  logger.info(`   • Echo RPC: ${process.env.ECHO_RPC_URL || 'https://subnets.avax.network/echo/testnet/rpc'}`);
  logger.info(`   • Dispatch RPC: ${process.env.DISPATCH_RPC_URL || 'https://subnets.avax.network/dispatch/testnet/rpc'}`);
  
  logger.info('🤖 *** LLM Configuration ***');
  const llmProviders = [
    { name: 'OpenAI', key: 'OPENAI_API_KEY' },
    { name: 'Anthropic', key: 'ANTHROPIC_API_KEY' },
    { name: 'OpenRouter', key: 'OPENROUTER_API_KEY' },
    { name: 'Google AI', key: 'GOOGLE_GENERATIVE_AI_API_KEY' },
    { name: 'Ollama', key: 'OLLAMA_API_ENDPOINT' }
  ];
  
  const configuredLLMs = llmProviders.filter(provider => process.env[provider.key]);
  
  if (configuredLLMs.length > 0) {
    logger.info(`   • Available LLMs: ${configuredLLMs.map(p => p.name).join(', ')}`);
  } else {
    logger.info('   • Using Local AI (no external LLM configured)');
  }
  
  logger.info('   • Avalanche Integration: ✅ ICTT for cross-chain token transfers');
  logger.info('   • ElizaOS Integration: ✅ Conversational AI managing real funds');
  logger.info('   • Demo User: 0x46d0ABa00628CeE1491f5A47c169929ff82A5b4D');
  
  logger.info('✨ *** aip Manager AI ready to manage cross-chain investments! ***');
  logger.info('📱 Try these commands:');
  logger.info('   • "Create a aip plan with 10 tokens monthly"');
  logger.info('   • "Show me my portfolio status"');
  logger.info('   • "Move funds from fuji to echo for better yields"');
  logger.info('   • "Emergency! Protect my funds!"');
  logger.info('   • "Optimize my portfolio allocation"');
};

export const projectAgent: ProjectAgent = {
  character,
  init: initCharacter,
  plugins: [web3aipPlugin],
};

const project: Project = {
  agents: [projectAgent],
};

export { testSuites } from './__tests__/e2e';
export { character } from './character.ts';

export default project;
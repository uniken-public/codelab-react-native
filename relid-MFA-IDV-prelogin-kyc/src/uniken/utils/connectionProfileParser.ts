interface RelId {
  Name: string;
  RelId: string;
}

interface Profile {
  Name: string;
  Host: string;
  Port: string | number; // Allow both string and number from JSON
}

interface AgentInfo {
  RelIds: RelId[];
  Profiles: Profile[];
}

interface ParsedAgentInfo {
  relId: string;
  host: string;
  port: number;
}

export const parseAgentInfo = (profileData: AgentInfo): ParsedAgentInfo => {
  if (!profileData.RelIds || profileData.RelIds.length === 0) {
    throw new Error('No RelIds found in agent info');
  }

  if (!profileData.Profiles || profileData.Profiles.length === 0) {
    throw new Error('No Profiles found in agent info');
  }

  // Always pick the first array objects
  const firstRelId = profileData.RelIds[0];

  if (!firstRelId.Name || !firstRelId.RelId) {
    throw new Error('Invalid RelId object - missing Name or RelId');
  }

  // Find matching profile by Name (1-1 mapping)
  const matchingProfile = profileData.Profiles.find(
    profile => profile.Name === firstRelId.Name
  );

  if (!matchingProfile) {
    throw new Error(`No matching profile found for RelId name: ${firstRelId.Name}`);
  }

  if (!matchingProfile.Host || !matchingProfile.Port) {
    throw new Error('Invalid Profile object - missing Host or Port');
  }

  // Convert port to number if it's a string
  const port = typeof matchingProfile.Port === 'string'
    ? parseInt(matchingProfile.Port, 10)
    : matchingProfile.Port;

  if (isNaN(port)) {
    throw new Error(`Invalid port value: ${matchingProfile.Port}`);
  }

  return {
    relId: firstRelId.RelId,
    host: matchingProfile.Host,
    port: port
  };
};

export const loadAgentInfo = async (): Promise<ParsedAgentInfo> => {
  try {
    const profileData = require('../cp/agent_info.json');
    return parseAgentInfo(profileData);
  } catch (error) {
    throw new Error(`Failed to load agent info: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Export types for testing and external use
export type { AgentInfo, ParsedAgentInfo, RelId, Profile };
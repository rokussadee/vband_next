import { MidiRequestPayload, createMessage } from '../lib/dto';
import axios from 'axios';

export const initAssistant = async () => {
  try {
    const response = await axios.post('/api/init-assistant', { });
    if (response.data.success) {
      return response.data.assistant;
    } else {
      console.error(response.data.error);
    }
  } catch (error) {
    console.error('Error initializing assistant:', error);
  }
  return null;
};

export const openThread = async () => {
  try {
    const response = await axios.post('/api/open-thread', { });
    if (response.data.success) {
      return response.data.thread;
    } else {
      console.error(response.data.error);
    }
  } catch (error) {
    console.error('Error opening thread:', error);
  }
  return null;
};

export const generateBaseLoop = async (
  threadID: string, 
  midiRequest: MidiRequestPayload,
  onStatusUpdate: (status: string) => void
): Promise<{ success: boolean; message?: string }> => {
  try {
    // Step 1: Generate the base loop
    const response = await axios.post('/api/generate-base-loop', { threadID, midiRequest });
    if (!response.data.success) {
      throw new Error(response.data.error);
    }
    const assistantMessage = response.data.assistantMessage;

    // Step 2: Create a new run
    const runResponse = await axios.post('/api/create-run', { threadID });
    if (!runResponse.data.success) {
      throw new Error(runResponse.data.error);
    }
    const runID = runResponse.data.run.id;

    // Step 3: Poll for run status
    let status = "pending";
    while (status !== "completed") {
      const pollResponse = await axios.post('/api/poll-run', { threadID, runID });
      if (!pollResponse.data.success) {
        throw new Error(pollResponse.data.error);
      }
      status = pollResponse.data.status;
      onStatusUpdate(status); // Update UI with the current status
      if (status !== "completed") {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Poll every second
      }
    }

    // Step 4: Get final messages
    const messagesResponse = await axios.post('/api/get-messages', { threadID });
    if (!messagesResponse.data.success) {
      throw new Error(messagesResponse.data.error);
    }

    messagesResponse.data.messages.forEach((element: any) => {
      console.log(element);
    });
    const lastMessage = messagesResponse.data.messages.filter((message: any) => message!.role === "assistant")
    .sort((a: any, b: any) => b.created_at - a.created_at)[0]; // Sort by created_at and take the latest one


    return { success: true, message: lastMessage };
  } catch (error) {
    console.error("Error in generateBaseLoop:", error);
    return { success: false, message: JSON.stringify(error)};
  }
};


export const createRun = async (threadID: string) => {
try {
    const response = await axios.post('/api/create-run', { threadID });

    if (response.status === 200) {
      console.log('Run successfully started:', response.data.run);
      return response.data;
    } else {
      console.error('Failed to start the run:', response.data.error);
      return { success: false, error: response.data.error };
    }
  } catch (error) {
    console.error('Error calling create-run API:', error);
    return { success: false, error };
  }
}

export const pollRunStatus = async (threadID: string, runID: string): Promise<string | null> => {
  try {
    const response = await axios.post('/api/poll-run', { threadID, runID });
    if (response.data.success) {
      console.log('Run completed successfully:', response.data.status);
      return response.data.status;
    } else {
      console.error('Failed to poll the run status:', response.data.error);
      return null;
    }
  } catch (error) {
    console.error('Error polling the run status:', error);
    return null;
  }
};

export const getMessages = async ( threadID: string) => {
  try {
    const response = await axios.post('/api/get-messages', { threadID });
    if (response.data.success) {
      return response.data.messages;
    } else {
      console.error(response.data.error);
    }
  } catch (error) {
    console.error('Error getting messages:', error);
  }
  return null;
};

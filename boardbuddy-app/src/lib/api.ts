import axios from 'axios'

export const API_BASE = 'https://lczm.me/boardbuddy/api'

export async function getBoards() {
  const response = await axios.get(`${API_BASE}/boards`)
  return response.data.boards
}

export async function getClimbs(boardId: string) {
  const response = await axios.get(`${API_BASE}/climbs?board_id=${boardId}`)
  return response.data.climbs.map(parseClimbData)
}

export async function getClimb(uuid: string) {
  const response = await axios.get(`${API_BASE}/climbs/${uuid}`)
  return parseClimbData(response.data)
}

function parseClimbData(climb: any) {
  return {
    ...climb,
    image_filenames: parseImageFilenames(climb.image_filenames)
  }
}

function parseImageFilenames(filenames: string) {
  try {
    return JSON.parse(filenames)
  } catch (e) {
    console.error('Error parsing image filenames:', e)
    return []
  }
}
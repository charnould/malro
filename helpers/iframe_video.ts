import { Event } from '../schema/event'

export const iframe_video = (input: Event['video_url']) => {
  // YouTube video
  return `<iframe src='${input}' title='YouTube video player' allowfullscreen='' frameborder='0' class='youtube' height='100%' width='100%'></iframe>`
}

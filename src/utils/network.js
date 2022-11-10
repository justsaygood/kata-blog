export default function NetworkDetector({ detectConnection }) {
  window.addEventListener('offline', () => {
    detectConnection()
  })

  window.addEventListener('online', () => {
    detectConnection()
  })
}

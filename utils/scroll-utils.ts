export const scrollToSection = (elementId: string) => {
  const element = document.getElementById(elementId)
  if (element) {
    // Get the header height to offset the scroll position
    const headerHeight = window.innerWidth >= 768 ? 80 : 60 // Adjust based on mobile/desktop header
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight

    // Use smooth scrolling
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })

    // Update URL hash without scrolling (prevents double scroll)
    setTimeout(() => {
      history.pushState(null, "", `#${elementId}`)
    }, 10)
  }
}

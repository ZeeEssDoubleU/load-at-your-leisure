import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// import components
import { Skeleton } from '@material-ui/lab'
import LazyLoad from 'react-lazyload'
// import utils
import useLayoutEffect from './utils/useIsomorphicLayoutEffect'

//* ***********
// component
//* ***********

export default function ProgressiveLazyImage({
  imageUrl_cloudinary,
  imageUrl_low,
  imageUrl_high,
  image
}) {
  const [image_loaded, setImageLoaded] = useState(false)
  const [imageUrl, setImageUrl] = useState()
  const imageContainerRef = useRef()

  // if no cloudinary url, check for supplied image (low quality) in props
  const image_low = imageUrl_cloudinary
    ? `${imageUrl_cloudinary}/dpr_auto,q_25,e_vectorize/${image.formats.thumbnail.hash}${image.ext}`
    : imageUrl_low

  useLayoutEffect(() => {
    const imageContainer = imageContainerRef.current
    const imageContainerWidth = imageContainer.offsetWidth
    const imageContainerWidth_125x = imageContainerWidth * 1.25

    // if no cloudinary url, check for supplied image (high quality) in props
    const image_high = imageUrl_cloudinary
      ? `${imageUrl_cloudinary}/w_${imageContainerWidth_125x},dpr_auto,q_auto/${image.hash}${image.ext}`
      : imageUrl_high

    // full image quality determined by container dimensions above
    setImageUrl(image_high)
  }, [image.ext, image.hash])

  return (
    <Container ref={imageContainerRef}>
      <LazyLoad
        once
        offset={500}
        // placeholder displays skeleton until lazy load complete
        placeholder={<StyledSkeleton variant='rect' animation='wave' />}
      >
        {/* low quality image */}
        <ProgressiveImage_Overlay
          src={image_low}
          image_loaded={image_loaded === true ? 'true' : 'false'}
        />
      </LazyLoad>
      {/* higher quality image lazyloads closer to view port than low quality image.  Prevents excessive bandwidth */}
      <LazyLoad once offset={100}>
        {/* high quality image */}
        <ProgressiveImage
          src={imageUrl}
          onLoad={() => {
            // only setImageLoaded to true if component loads with image url
            if (imageUrl !== 'undefined') {
              setImageLoaded(true)
            }
          }}
        />
      </LazyLoad>
    </Container>
  )
}

ProgressiveLazyImage.propTypes = {
  image: PropTypes.object,
  imageUrl_cloudinary: PropTypes.string,
  imageUrl_low: PropTypes.string,
  imageUrl_high: PropTypes.string
}

//* ***********
// styles
//* ***********

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
`
const StyledSkeleton = styled(Skeleton)`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`
const ProgressiveImage_Overlay = styled.img`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  /* progressive blur up effect and transition */
  filter: blur(4px);
  opacity: ${(props) => (props.image_loaded === 'true' ? 0 : 1)};
  transition: opacity 1s;
`
const ProgressiveImage = styled.img`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

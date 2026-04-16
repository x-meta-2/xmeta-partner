import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '#/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';

export const AuthCarousel = () => {
  return (
    <Carousel
      className="h-full w-full"
      plugins={[
        Autoplay({
          delay: 5000,
        }),
        Fade(),
      ]}
      opts={{
        loop: true,
        duration: 100,
      }}
    >
      <CarouselContent className="h-[89vh]">
        <CarouselItem>
          <img
            src={
              'https://dp1fq59gs1u5e.cloudfront.net/assets/web/gahai_web_login.png'
            }
            alt="Login"
            className="rounded-2xl h-full w-full object-cover"
          />
        </CarouselItem>
        <CarouselItem>
          <img
            src={
              'https://dp1fq59gs1u5e.cloudfront.net/assets/web/login-crypto-warning.png'
            }
            alt="Login"
            className="rounded-2xl h-full w-full object-cover"
          />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
};

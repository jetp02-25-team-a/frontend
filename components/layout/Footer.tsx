import LinkButton from '@/components/ui/link_button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faInstagram,
  faGoogle,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
export default function Footer() {
  return (
    <>
      <div className="yellow-orange h-[354px] px-[340px] pt-[70px] pb-[30px] text-white w-full flex flex-col items-center rounded-t-2xl gap-[30px]">
        <div className="flex justify-between w-full">
          <div className="flex flex-col w-[357px] ">
            <img
              src="/logo_white.png"
              alt=""
              className="w-[206px] h-full object-contain"
            />
            <p>
              don’t delay, it’s time for you to travel around the world and
              discover other new and interesting things.
            </p>
          </div>
          <div className="flex flex-col gap-[18px]">
            <div className="flex space-x-[12px]">
              <LinkButton>
                <FontAwesomeIcon icon={faFacebookF} />
              </LinkButton>
              <LinkButton>
                <FontAwesomeIcon icon={faInstagram} />
              </LinkButton>
              <LinkButton>
                <FontAwesomeIcon icon={faGoogle} />
              </LinkButton>
              <LinkButton>
                <FontAwesomeIcon icon={faYoutube} />
              </LinkButton>
            </div>
            <p>stay update to our newslutter</p>
            <button className="bg-[#FFF4EC] w-[317px] h-[60px] text-[#B76565] rounded-2xl">
              訂閱我們
            </button>
          </div>
        </div>
        <hr className="w-full border-t-2 border-white my-4" />
        <div>© 2025 EvenToury. All rights reserved.</div>
      </div>
    </>
  );
}

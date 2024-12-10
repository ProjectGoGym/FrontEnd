import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { IoChatbubblesOutline } from "react-icons/io5";
import profile from "../../public/default_profile.png";
import Link from "next/link";
import useTimeAgo from "@/hooks/useTimeAgo";
import DefaultProfile from "../UI/DefaultProfile";

interface PostType {
  id: string;
  authorNickName: string;
  created_at: string;
  gymName: string;
  imageUrl1: string;
  postStatus: string;
  title: string;
  wishCount: number;
}

export default function PostItem({
  id,
  authorNickName,
  created_at,
  gymName,
  imageUrl1,
  postStatus,
  title,
  wishCount,
}: PostType) {
  const postStatusKo = postStatus === "POSTING" && "게시중";

  const timeago = useTimeAgo(created_at);

  return (
    <Link href={`/community/${id}`}>
      <div className="h-80 w-80 cursor-pointer rounded-lg border border-[#ccc] shadow">
        <div>
          <div className="m-2 flex justify-between">
            <div className="badge border-none bg-blue-300 pb-3 pt-3 text-sm font-bold text-white">
              {postStatusKo}
            </div>
            <p className="text-xs text-gray-500">{timeago}</p>
          </div>
          <div className="flex h-56 flex-col justify-between border-b border-[#ccc] pb-1">
            {imageUrl1 ? (
              <Image
                src={imageUrl1}
                alt="헬스장 사진"
                width={200}
                height={140}
                priority
              />
            ) : (
              <div className="flex h-[140px] items-center justify-center bg-gray-400 bg-opacity-50">
                기본 이미지
              </div>
            )}

            <p className="ml-2">{title}</p>
            <div className="mr-2 flex flex-col items-end">
              <p className="text-sm font-bold text-gray-500">{gymName}</p>
            </div>
          </div>
        </div>
        <div className="ml-2 mr-2 mt-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <FaHeart color="#DC7D7D" />{" "}
              <span className="ml-1 text-sm font-normal text-gray-500">
                {wishCount}
              </span>
            </div>
            <div className="flex items-center">
              <IoChatbubblesOutline size={24} />{" "}
              <span className="ml-1 text-sm font-normal text-gray-500">
                100
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
            <div className="avatar">
              <DefaultProfile width="10" />
            </div>
            {authorNickName}
          </div>
        </div>
      </div>
    </Link>
  );
}

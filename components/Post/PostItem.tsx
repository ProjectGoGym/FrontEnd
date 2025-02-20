"use client";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";

import Link from "next/link";
import useTimeAgo from "@/hooks/useTimeAgo";
import DefaultProfile from "../UI/DefaultProfile";
import ProfileImage from "../UI/ProfileImage";

interface PostType {
  postId: string;
  authorNickname: string;
  createdAt: string;
  authorProfileImageUrl: string;
  gymName: string;
  imageUrl1: string;
  status: string;
  title: string;
  wishCount: number;
  postType: string;
}

export default function PostItem({
  postId,
  authorNickname,
  createdAt,
  authorProfileImageUrl,
  gymName,
  imageUrl1,
  status,
  title,
  wishCount,
  postType,
}: PostType) {
  let postStatusKo = "게시중";
  if (status === "PENDING") {
    postStatusKo = "게시중";
  } else if (status === "IN_PROGRESS") {
    postStatusKo = "거래중";
  } else {
    postStatusKo = "거래완료";
  }
  let itemPostType = "팝니다";
  if (postType === "SELL") {
    itemPostType = "팝니다";
  } else if (postType === "BUY") {
    itemPostType = "삽니다";
  }

  const timeago = useTimeAgo(createdAt);

  return (
    <Link href={`/community/${postId}`}>
      <div className="mb-10 h-80 w-80 cursor-pointer rounded-lg border border-[#ccc] shadow">
        <div>
          <div className="m-2 flex justify-between">
            <div>
              <div className="badge border-none bg-blue-500 pb-3 pt-3 text-sm font-bold text-white">
                {postStatusKo}
              </div>
              <div
                className={`badge ml-2 border-none bg-green-500 pb-3 pt-3 text-sm font-bold text-white ${postType === "BUY" ? "bg-red-500" : ""}`}
              >
                {itemPostType}
              </div>
            </div>
            <p className="text-xs text-gray-500">{timeago}</p>
          </div>
          <div className="flex h-56 flex-col justify-between border-b border-[#ccc] pb-1">
            {imageUrl1 ? (
              <div className="relative flex h-[140px] items-center justify-center bg-gray-400 bg-opacity-50">
                <Image src={imageUrl1} alt="헬스장 사진" fill priority />
              </div>
            ) : (
              <div className="flex h-[140px] items-center justify-center bg-gray-400 bg-opacity-50">
                No-Image
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
          </div>

          <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
            <div className="avatar overflow-hidden rounded-full">
              {authorProfileImageUrl ? (
                <ProfileImage src={authorProfileImageUrl} />
              ) : (
                <DefaultProfile width="10" />
              )}
            </div>
            {authorNickname}
          </div>
        </div>
      </div>
    </Link>
  );
}

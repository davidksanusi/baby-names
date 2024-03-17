"use client";
import Navbar from "@/components/HomaPage/Navbar";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import "../../globals.css";
import Feedback from "@/components/HomaPage/feedback";
import OverviewFooter from "@/components/Overview/footer";
import { Skeleton } from "antd";
import { useRouter } from "next/navigation";

const Overview = ({ params }) => {
  const [babyData, setBabyData] = useState(null);
  const [randomNamesData, setRandomNamesData] = useState(true);
  const [loading, setLoading] = useState(true);
  const [randomNamesLoading, setRandomNamesLoading] = useState(null);
  const router = useRouter();

  const [slug, setSlug] = useState(params.name);
  // const
  const [openQuestions, setOpenQuestions] = useState([]);

  const toggleQuestion = (index) => {
    setOpenQuestions((prevOpenQuestions) => {
      const updatedOpenQuestions = [...prevOpenQuestions];
      updatedOpenQuestions[index] = !updatedOpenQuestions[index];
      return updatedOpenQuestions;
    });
  };

  const fetchBabyData = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://babynames-backend.onrender.com/api/post_name",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: slug[0] }),
        }
      );

      if (!response.ok) {
        setLoading(false);
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      await setBabyData(data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.error("Error fetching data:", error);
    }
  };
  const fetchRandomNames = async () => {
    try {
      setRandomNamesLoading(true);
      const response = await fetch(
        "https://babynames-backend.onrender.com/api/get_random_names",
       
      );

      if (!response.ok) {
        setRandomNamesLoading(false);
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      await setRandomNamesData(data);
      setRandomNamesLoading(false);
    } catch (error) {
      setRandomNamesLoading(false);

      console.error("Error fetching data:", error);
    }
  };
  useMemo(() => {
    fetchBabyData();
    fetchRandomNames();
  }, []);

  return (
    <>
      <Navbar />
      <div className="px-4 md:px-6 lg:px-24 xl:px-40 py-6 flex flex-col">
        <p className="font-black leading-normal text-[#0D121C] text-4xl py-4">
          {params.name}
        </p>

        {/* Overview */}
        <div className="flex flex-col gap-3 py-3 justify-start items-start">
          <p className="text-2xl font-bold leading-normal text-[#0D121C]">
            Overview
          </p>
          {loading == null || (loading && !babyData?.name_overview) ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <p className="text-[#0D121C] text-base leading-normal">
              {babyData?.name_overview}
            </p>
          )}{" "}
        </div>

        {/* Quick Facts */}
        <div className="flex flex-col gap-3 py-3 justify-start items-start w-full">
          <p className="text-2xl font-bold leading-normal text-[#0D121C]">
            Quick Facts
          </p>
          {loading == null || loading ? (
            // Display four loading cards
            <div className="flex flex-wrap w-full">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex  flex-col md:flex-row justify-between items-center w-[50%]"
                >
                  <div className="flex flex-col gap-1 justy-start items-start py-4 border-t border-[#E5E8EB] w-full">
                    <Skeleton
                      active
                      style={{ width: "45%" }}
                      paragraph={{ rows: 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap w-full">
              {babyData?.quick_facts?.map((item, index) => (
                <div
                  key={index}
                  className="flex  flex-col md:flex-row justify-between items-center w-[50%]"
                >
                  <div className="flex flex-col gap-1 justy-start items-start py-4 border-t border-[#E5E8EB] w-full">
                    <p className="text-[#4A699C] text-sm leading-normal">
                      {item.title}
                    </p>
                    <p className="text-[#0D121C] text-sm leading-normal">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FAQs */}
        {loading || loading == null ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : (
          <div className="flex flex-col gap-3 py-3 my-3 justify-start items-start w-full">
            <p className="text-2xl font-bold leading-normal text-[#0D121C]">
              {babyData?.faq?.faq_title}
            </p>
            <div className="flex flex-col justify-start items-start w-full">
              {babyData?.faq?.faq_body[0].map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 justify-between items-center py-4 border-t border-[#E5E8EB] w-full"
                >
                  <div className="flex flex-col gap-2">
                    <p className="text-[#0D121C] text--sm leading-normal">
                      {item.question}
                    </p>
                    {openQuestions[index] && (
                      <p className="text-[#4A699C] text--sm leading-normal">
                        {item.answer}
                      </p>
                    )}
                  </div>
                  <Image
                    alt=""
                    className="cursor-pointer"
                    onClick={() => toggleQuestion(index)}
                    src={
                      !openQuestions[index]
                        ? "/icons/arrow-bottom.svg"
                        : "/icons/arrow-top.svg"
                    }
                    width={20}
                    height={20}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explore Names */}
        <div className="flex flex-col gap-3 py-3 justify-start items-start w-full pb-16">
          <p className="text-2xl font-bold leading-normal text-[#0D121C]">
            Explore Names
          </p>
          <div className="flex gap-3 justify-start items-center overflow-x-scroll noScrollBar w-full">
            {randomNamesLoading == null || randomNamesLoading
              ? // Display four loading cards
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-[176px] h-[99px] rounded-xl flex justify-center items-center underline p-6 text-4xl font-bold leading-normal text-white bg-gradient-to-r from-[#383838] to-[#928F8F]"
                  >
                    <Skeleton active title={{ width: "100%" }} />
                  </div>
                ))
              : // Display data if available
                randomNamesData?.random_names?.map((item, index) => (
                  <div
                  onClick={() => router.push(`/overview/${item.name}`)}
                    key={index}
                    className="w-[176px] cursor-pointer h-[99px] rounded-xl flex justify-center items-center underline p-6 text-4xl font-bold leading-normal text-white bg-gradient-to-r from-[#383838] to-[#928F8F]"
                  >
                    {item.name}
                  </div>
                ))}
          </div>
        </div>

        {/* Explore Categories */}
        <div className="flex flex-col gap-3 py-3 justify-start items-start w-full">
          <p className="text-2xl font-bold leading-normal text-[#0D121C]">
            Explore Categories
          </p>

          {loading == null || loading ? (
            // Display four loading cards
            <div className="flex gap-2 justify-start items-center flex-wrap">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex  flex-row justify-between items-center "
                >
                  <div className="min-w-[200px] rounded-2xl bg-[#E8EDF5] font-medium text-[#0D121C] text-sm leading-normal p-4 text-start">
                    {" "}
                    <Skeleton
                      title={{ width: "100%" }}
                      active
                      paragraph={{ rows: 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-2 justify-start items-center flex-wrap">
              {babyData?.categories?.map((item, index) => (
                <p
                  key={index}
                  onClick={() => router.push(`/?slug_input=${item.slug?.replaceAll('/','')}`)}

                  className="min-w-fit rounded-2xl bg-[#E8EDF5] cursor-pointer font-medium text-[#0D121C] text-sm leading-normal p-2 px-4 text-start"
                >
                  {item.title}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Feedback */}
        <Feedback />

        {/* Footer */}
        <OverviewFooter />
      </div>
    </>
  );
};

export default Overview;

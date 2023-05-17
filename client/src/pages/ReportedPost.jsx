import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { clearPostAction, getPostAction } from "../redux/actions/postActions";
import { useSelector, useDispatch } from "react-redux";
import CommonLoading from "../components/loader/CommonLoading";

import ViewReportedPost from "../components/moderator/ViewReportedPost";
import CommentSidebar from "../components/post/CommentSidebar";
const ReportedPost = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const postId = location.state.postId;

  useEffect(() => {
    dispatch(getPostAction(postId));
    return () => {
      dispatch(clearPostAction());
    };
  }, [dispatch, postId]);

  const post = useSelector((state) => state.posts?.post);

  if (!post) return <CommonLoading />;
  return (
    <>
      <div className="w-6/12">
        <ViewReportedPost post={post} />
      </div>
      <CommentSidebar comments={post.comments} />
    </>
  );
};

export default ReportedPost;

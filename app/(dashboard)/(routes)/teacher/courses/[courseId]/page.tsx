const CoursePage = ({ params }: { params: { courseId: string } }) => {
 const { courseId } = params;

 return <div>{courseId}</div>;
};

export default CoursePage;

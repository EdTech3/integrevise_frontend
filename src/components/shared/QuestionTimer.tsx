interface Props {
    time: string;
}

const QuestionTimer = ({ time }: Props) => {
    return (
        <div className='bg-secondary-100 rounded-xl px-8 py-1.5'>
            {time}
        </div>
    )
}

export default QuestionTimer 
import { Card, CardContent } from '@/components/ui/card';
import StudentInfoCardItem from './StudentInfoCardItem';


interface Props {
    name: string;
    image: string;
    number: string;
    vivaStatus: string;
    startDate: string;
    endDate: string;
    duration: string
    incident: number
}

const StudentInfoCard = ({ name, image, number, vivaStatus, startDate, endDate, duration, incident }: Props) => {
    return (
        <Card className='bg-foreground py-8 px-4 lg:p-4'>
            <CardContent className='flex flex-col items-center lg:items-start lg:flex-row gap-12 lg:gap-28'>
                <figure
                    className='w-72 h-72 relative rounded-lg overflow-clip bg-foreground'
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundBlendMode: 'overlay',
                        backgroundPosition: 'center'
                    }}
                />
                <div className='flex-grow grid grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-12'>
                    <StudentInfoCardItem title='Name' value={name} />
                    <StudentInfoCardItem title='Number' value={number} />
                    <StudentInfoCardItem title='Viva Status' value={vivaStatus} />
                    <StudentInfoCardItem title='Start Date' value={startDate} />
                    <StudentInfoCardItem title='End Date' value={endDate} />
                    <StudentInfoCardItem title='Duration' value={duration} />
                    <StudentInfoCardItem title='Incident' value={incident.toString()} />
                </div>

            </CardContent>
        </Card>
    )
}

export default StudentInfoCard
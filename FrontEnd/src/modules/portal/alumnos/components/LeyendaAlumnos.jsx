
export default function LeyendaAlumnos() {
	return (
		<div className='flex flex-row items-center gap-[16px]'>
		<div className='leyenda flex flex-row gap-[8px]'>
			<div style={{
				width: "20px",
				height: "20px",
				borderRadius: "50%",
				border: "4px solid #8667F1",
				backgroundColor: "#E5E8FB"
			}}></div>
			<div>
				Cita programada
			</div>
		</div>
		<div className='leyenda flex flex-row gap-[8px]'>
			<div style={{
				width: "20px",
				height: "20px",
				borderRadius: "50%",
				border: "4px solid #22B14C",
				backgroundColor: "#79E07F"
			}}></div>
			<div>
				Cita completada
			</div>
		</div>
	</div>
	)
}
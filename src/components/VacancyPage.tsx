import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchVacancyById, clearCurrentVacancy } from "../store/slices/vacanciesSlice";
import { type RootState, type AppDispatch } from "../store/store";


const HtmlContent = ({ content, fallback }: { content?: string; fallback: string }) => {
  if (!content) return <p>{fallback}</p>;
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

const VacancyPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentVacancy, detailsLoading, detailsError } = useSelector(
    (state: RootState) => state.vacancies
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchVacancyById(id));
    }
    return () => {
      dispatch(clearCurrentVacancy());
    };
  }, [id, dispatch]);

  if (detailsLoading) return <div>Загрузка вакансии</div>;
  if (detailsError) return <div>Ошибка: {detailsError}</div>;
  if (!currentVacancy) return <div>Вакансия не найдена</div>;

  return (
    <div className="vacancy-page-container">
      <button onClick={() => navigate(-1)}>Назад</button>

      <h1>{currentVacancy.name}</h1>

      {currentVacancy.employer && <h3>Компания: {currentVacancy.employer.name}</h3>}

      {currentVacancy.salary && (
        <p className="salary">
          Зарплата: {currentVacancy.salary.from ? `от ${currentVacancy.salary.from}` : ""}
          {currentVacancy.salary.to ? ` до ${currentVacancy.salary.to}` : ""}
          {` ${currentVacancy.salary.currency}`}
        </p>
      )}

      <div className="vacancy-description">
        <h2>Описание вакансии:</h2>
        <HtmlContent
          content={currentVacancy.description}
          fallback="Описание отсутствует."
        />
      </div>

      <div className="company-description">
        <h2>О компании:</h2>
        <HtmlContent
          content={currentVacancy.about_company}
          fallback="Информация отсутствует."
        />
      </div>
    </div>
  );
};

export default VacancyPage;

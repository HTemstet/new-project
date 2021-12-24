import { TypesEnum } from '../Services/request.service';

export class CriterionsofAreas
{
    constructor(
      public CriterionofAreaCode=0,
      public CriterionCode=0,
      public CriterionsTitleCode=0,
      public Name='',
      public CriterionsType=0,
      public ComparisonOperator=0,
      public AreaCode=0,
      public FeildValidation='',
      public PatternErrorMessage='',
      public Employee=false,
      public Employer=false,
      public CriterionsofAreasTree=new Array<CriterionsofAreas>(),
      public TypeEnum=TypesEnum.List,
      public PartOfAListTree=new Array<CriterionsofAreas>(),
      public RegularTree=new Array<CriterionsofAreas>(),
      public ValueofCriterion:any=null,
      public CriterionsDependencyNumber=0,
      public LevelofImportance=0,
      public invalid_message='',
      public required='',
      public multipleselect=false,
      public Check = false
    )
    {}
  }